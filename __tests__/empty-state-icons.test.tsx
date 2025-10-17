/**
 * Empty State Icons Tests
 * Tests for icon components used in empty states
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import {
  SparklesIcon,
  AlertTriangleIcon,
  WifiOffIcon,
  FileQuestionIcon,
} from '../src/components/icons/EmptyStateIcons';

describe('Empty State Icons', () => {
  describe('SparklesIcon', () => {
    it('renders correctly', () => {
      const { toJSON } = render(<SparklesIcon />);
      expect(toJSON()).toBeTruthy();
    });

    it('accepts custom size', () => {
      const { toJSON } = render(<SparklesIcon size={48} />);
      expect(toJSON()).toBeTruthy();
    });

    it('accepts custom color', () => {
      const { toJSON } = render(<SparklesIcon color="#FF0000" />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('AlertTriangleIcon', () => {
    it('renders correctly', () => {
      const { toJSON } = render(<AlertTriangleIcon />);
      expect(toJSON()).toBeTruthy();
    });

    it('accepts custom size', () => {
      const { toJSON } = render(<AlertTriangleIcon size={48} />);
      expect(toJSON()).toBeTruthy();
    });

    it('accepts custom color', () => {
      const { toJSON } = render(<AlertTriangleIcon color="#FF0000" />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('WifiOffIcon', () => {
    it('renders correctly', () => {
      const { toJSON } = render(<WifiOffIcon />);
      expect(toJSON()).toBeTruthy();
    });

    it('accepts custom size', () => {
      const { toJSON } = render(<WifiOffIcon size={48} />);
      expect(toJSON()).toBeTruthy();
    });

    it('accepts custom color', () => {
      const { toJSON } = render(<WifiOffIcon color="#FF0000" />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('FileQuestionIcon', () => {
    it('renders correctly', () => {
      const { toJSON } = render(<FileQuestionIcon />);
      expect(toJSON()).toBeTruthy();
    });

    it('accepts custom size', () => {
      const { toJSON } = render(<FileQuestionIcon size={48} />);
      expect(toJSON()).toBeTruthy();
    });

    it('accepts custom color', () => {
      const { toJSON } = render(<FileQuestionIcon color="#FF0000" />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Icon Consistency', () => {
    it('all icons render without errors', () => {
      const icons = [
        <SparklesIcon key="sparkles" />,
        <AlertTriangleIcon key="alert" />,
        <WifiOffIcon key="wifi" />,
        <FileQuestionIcon key="file" />,
      ];

      icons.forEach((icon) => {
        const { toJSON } = render(icon);
        expect(toJSON()).toBeTruthy();
      });
    });

    it('all icons accept size prop', () => {
      const icons = [
        <SparklesIcon key="sparkles" size={64} />,
        <AlertTriangleIcon key="alert" size={64} />,
        <WifiOffIcon key="wifi" size={64} />,
        <FileQuestionIcon key="file" size={64} />,
      ];

      icons.forEach((icon) => {
        const { toJSON } = render(icon);
        expect(toJSON()).toBeTruthy();
      });
    });
  });
});
