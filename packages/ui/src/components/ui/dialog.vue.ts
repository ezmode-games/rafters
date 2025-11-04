/**
 * Dialog component - Vue 3 Composition API version
 * Uses the SAME primitives as React version
 * Demonstrates framework portability
 */

import {
  computed,
  defineComponent,
  h,
  type InjectionKey,
  inject,
  onMounted,
  onUnmounted,
  provide,
  type Ref,
  ref,
  Teleport,
  watch,
} from 'vue';
import {
  getDialogAriaProps,
  getOverlayAriaProps,
  getTriggerAriaProps,
} from '../../primitives/dialog-aria';
import { onEscapeKeyDown } from '../../primitives/escape-keydown';
import { createFocusTrap, preventBodyScroll } from '../../primitives/focus-trap';
import { generateId } from '../../primitives/id-generator';
import { onPointerDownOutside } from '../../primitives/outside-click';

// Context for sharing dialog state
interface DialogContext {
  open: Ref<boolean>;
  setOpen: (value: boolean) => void;
  contentId: string;
  titleId: string;
  descriptionId: string;
  modal: boolean;
}

const DialogContextKey: InjectionKey<DialogContext> = Symbol('DialogContext');

function useDialogContext() {
  const context = inject(DialogContextKey);
  if (!context) {
    throw new Error('Dialog components must be used within Dialog component');
  }
  return context;
}

// ==================== Dialog (Root) ====================

export const Dialog = defineComponent({
  name: 'Dialog',
  props: {
    open: Boolean,
    defaultOpen: {
      type: Boolean,
      default: false,
    },
    modal: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:open'],
  setup(props, { slots, emit }) {
    // Internal state for uncontrolled mode
    const internalOpen = ref(props.defaultOpen);

    // Computed open state (controlled or uncontrolled)
    const isControlled = computed(() => props.open !== undefined);
    const open = computed(() => (isControlled.value ? props.open : internalOpen.value));

    const setOpen = (value: boolean) => {
      if (!isControlled.value) {
        internalOpen.value = value;
      }
      emit('update:open', value);
    };

    // Generate stable IDs
    const contentId = generateId('dialog-content');
    const titleId = generateId('dialog-title');
    const descriptionId = generateId('dialog-description');

    // Provide context
    provide(DialogContextKey, {
      open,
      setOpen,
      contentId,
      titleId,
      descriptionId,
      modal: props.modal,
    });

    return () => slots.default?.();
  },
});

// ==================== DialogTrigger ====================

export const DialogTrigger = defineComponent({
  name: 'DialogTrigger',
  setup(_props, { slots }) {
    const { open, setOpen, contentId } = useDialogContext();

    const ariaProps = computed(() =>
      getTriggerAriaProps({
        open: open.value,
        controlsId: contentId,
      }),
    );

    const handleClick = () => {
      setOpen(!open.value);
    };

    return () =>
      h(
        'button',
        {
          type: 'button',
          onClick: handleClick,
          ...ariaProps.value,
        },
        slots.default?.(),
      );
  },
});

// ==================== DialogPortal ====================

export const DialogPortal = defineComponent({
  name: 'DialogPortal',
  props: {
    to: {
      type: String,
      default: 'body',
    },
  },
  setup(props, { slots }) {
    const { open } = useDialogContext();
    const mounted = ref(false);

    onMounted(() => {
      mounted.value = true;
    });

    return () => {
      if (!mounted.value || !open.value) {
        return null;
      }

      // Vue's h() with Teleport has typing issues with built-in components
      // Using any is the recommended approach for Teleport in render functions
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // biome-ignore lint/suspicious/noExplicitAny: Vue's Teleport has known typing limitations in render functions
      return h(Teleport as any, { to: props.to }, slots.default?.());
    };
  },
});

// ==================== DialogOverlay ====================

export const DialogOverlay = defineComponent({
  name: 'DialogOverlay',
  props: {
    class: String,
  },
  setup(props, { slots }) {
    const { open } = useDialogContext();

    const ariaProps = computed(() =>
      getOverlayAriaProps({
        open: open.value,
      }),
    );

    return () =>
      open.value
        ? h(
            'div',
            {
              class: `fixed inset-0 z-50 bg-black/80 ${props.class || ''}`.trim(),
              ...ariaProps.value,
            },
            slots.default?.(),
          )
        : null;
  },
});

// ==================== DialogContent ====================

export const DialogContent = defineComponent({
  name: 'DialogContent',
  props: {
    class: String,
  },
  emits: ['escapeKeyDown', 'pointerDownOutside', 'interactOutside'],
  setup(props, { slots, emit }) {
    const { open, setOpen, contentId, titleId, descriptionId, modal } = useDialogContext();
    const contentRef = ref<HTMLElement | null>(null);

    // Focus trap
    watch(
      [open, () => contentRef.value],
      ([isOpen, element]) => {
        if (!isOpen || !modal || !element) return;

        const cleanup = createFocusTrap(element as HTMLElement);
        return cleanup;
      },
      { flush: 'post' },
    );

    // Body scroll lock
    watch(
      open,
      (isOpen) => {
        if (!isOpen || !modal) return;

        const cleanup = preventBodyScroll();
        onUnmounted(cleanup);
      },
      { immediate: true },
    );

    // Escape key handler
    watch(
      open,
      (isOpen) => {
        if (!isOpen) return;

        const cleanup = onEscapeKeyDown((event) => {
          emit('escapeKeyDown', event);
          if (!event.defaultPrevented) {
            setOpen(false);
          }
        });

        onUnmounted(cleanup);
      },
      { immediate: true },
    );

    // Outside click handler
    watch(
      [open, () => contentRef.value],
      ([isOpen, element]) => {
        if (!isOpen || !modal || !element) return;

        const cleanup = onPointerDownOutside(element as HTMLElement, (event) => {
          emit('pointerDownOutside', event);
          emit('interactOutside', event);

          if (!event.defaultPrevented) {
            setOpen(false);
          }
        });

        onUnmounted(cleanup);
      },
      { flush: 'post' },
    );

    const ariaProps = computed(() =>
      getDialogAriaProps({
        open: open.value,
        labelId: titleId,
        descriptionId,
        modal,
      }),
    );

    return () =>
      open.value
        ? h(
            'div',
            {
              ref: contentRef,
              id: contentId,
              class:
                `fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] ${props.class || ''}`.trim(),
              ...ariaProps.value,
            },
            slots.default?.(),
          )
        : null;
  },
});

// ==================== DialogTitle ====================

export const DialogTitle = defineComponent({
  name: 'DialogTitle',
  props: {
    class: String,
  },
  setup(props, { slots }) {
    const { titleId } = useDialogContext();

    return () =>
      h(
        'h2',
        {
          id: titleId,
          class: props.class,
        },
        slots.default?.(),
      );
  },
});

// ==================== DialogDescription ====================

export const DialogDescription = defineComponent({
  name: 'DialogDescription',
  props: {
    class: String,
  },
  setup(props, { slots }) {
    const { descriptionId } = useDialogContext();

    return () =>
      h(
        'p',
        {
          id: descriptionId,
          class: props.class,
        },
        slots.default?.(),
      );
  },
});

// ==================== DialogClose ====================

export const DialogClose = defineComponent({
  name: 'DialogClose',
  setup(_props, { slots }) {
    const { setOpen } = useDialogContext();

    const handleClick = () => {
      setOpen(false);
    };

    return () =>
      h(
        'button',
        {
          type: 'button',
          onClick: handleClick,
        },
        slots.default?.(),
      );
  },
});

// Export all components
export default {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
