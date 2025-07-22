import '@testing-library/jest-dom';
import { setProjectAnnotations } from '@storybook/react-vite';
import * as projectAnnotations from '../.storybook/preview';

// Setup Storybook project annotations for composeStories
setProjectAnnotations(projectAnnotations);
