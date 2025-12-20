/**
 * Cloudflare Queue Status Client
 *
 * Uses the Cloudflare GraphQL Analytics API to get queue backlog metrics.
 * Works with both push (Worker) and pull (HTTP) consumers.
 *
 * @see https://developers.cloudflare.com/queues/observability/metrics/
 */

import { z } from 'zod';

/**
 * Queue status response for our API
 */
export const queueStatusSchema = z.object({
  backlogCount: z.number(),
  error: z.string().optional(),
});
export type QueueStatus = z.infer<typeof queueStatusSchema>;

/**
 * Configuration for the queue status client
 */
interface QueueStatusConfig {
  accountId: string;
  apiToken: string;
  queueId: string;
}

/**
 * GraphQL query for queue backlog metrics
 */
const BACKLOG_QUERY = `
query QueueBacklog($accountId: String!, $queueId: String!, $since: Time!, $until: Time!) {
  viewer {
    accounts(filter: { accountTag: $accountId }) {
      queuesBacklogAdaptiveGroups(
        filter: { queueId: $queueId, datetime_geq: $since, datetime_leq: $until }
        limit: 1
        orderBy: [datetime_DESC]
      ) {
        dimensions {
          queueId
          datetime
        }
        avg {
          backlog
          bytes
        }
      }
    }
  }
}
`;

interface GraphQLResponse {
  data?: {
    viewer?: {
      accounts?: Array<{
        queuesBacklogAdaptiveGroups?: Array<{
          avg?: {
            backlog?: number;
            bytes?: number;
          };
        }>;
      }>;
    };
  };
  errors?: Array<{ message: string }>;
}

/**
 * Fetch queue backlog using the Cloudflare GraphQL Analytics API
 *
 * @param config - Cloudflare credentials and queue ID
 * @returns Queue status with backlog count
 */
export async function fetchQueueStatus(config: QueueStatusConfig): Promise<QueueStatus> {
  const { accountId, apiToken, queueId } = config;

  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  try {
    const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: BACKLOG_QUERY,
        variables: {
          accountId,
          queueId,
          since: fiveMinutesAgo.toISOString(),
          until: now.toISOString(),
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        backlogCount: 0,
        error: `API error ${response.status}: ${errorText}`,
      };
    }

    const data = (await response.json()) as GraphQLResponse;

    if (data.errors?.length) {
      return {
        backlogCount: 0,
        error: data.errors.map((e) => e.message).join(', '),
      };
    }

    const backlogData = data.data?.viewer?.accounts?.[0]?.queuesBacklogAdaptiveGroups?.[0];
    const backlogCount = backlogData?.avg?.backlog ?? 0;

    return { backlogCount };
  } catch (error) {
    return {
      backlogCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get queue ID from queue name using the Queues API
 *
 * @param accountId - Cloudflare account ID
 * @param apiToken - Cloudflare API token
 * @param queueName - Name of the queue
 * @returns Queue ID or null if not found
 */
export async function getQueueId(
  accountId: string,
  apiToken: string,
  queueName: string,
): Promise<string | null> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/queues`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      success: boolean;
      result: Array<{ queue_id: string; queue_name: string }>;
    };

    if (!data.success) {
      return null;
    }

    const queue = data.result.find((q) => q.queue_name === queueName);
    return queue?.queue_id ?? null;
  } catch {
    return null;
  }
}
