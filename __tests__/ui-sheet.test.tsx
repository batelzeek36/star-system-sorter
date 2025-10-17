/**
 * Sheet Primitive (NativeWind) Tests
 * Tests for NativeWind Sheet primitive (modal presentation)
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Sheet, SheetHeader, SheetTitle, SheetDescription } from '../src/ui/Sheet';

describe('Sheet (NativeWind Primitive)', () => {
  describe('Modal Behavior', () => {
    it('renders when visible is true', () => {
      const { getByTestId } = render(
        <Sheet visible={true} onClose={jest.fn()} testID="test-sheet">
          <SheetTitle>Test Sheet</SheetTitle>
        </Sheet>
      );
      expect(getByTestId('test-sheet')).toBeTruthy();
    });

    it('does not render when visible is false', () => {
      const { queryByTestId } = render(
        <Sheet visible={false} onClose={jest.fn()} testID="test-sheet">
          <SheetTitle>Test Sheet</SheetTitle>
        </Sheet>
      );
      expect(queryByTestId('test-sheet')).toBeNull();
    });

    it('calls onClose when modal requests close', () => {
      const onClose = jest.fn();
      const { getByTestId } = render(
        <Sheet visible={true} onClose={onClose} testID="test-sheet">
          <SheetTitle>Test Sheet</SheetTitle>
        </Sheet>
      );
      const modal = getByTestId('test-sheet');
      
      // Simulate modal request close (e.g., back button on Android)
      if (modal.props.onRequestClose) {
        modal.props.onRequestClose();
      }
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Overlay Dismissal', () => {
    it('calls onClose when overlay is pressed', () => {
      const onClose = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <Sheet visible={true} onClose={onClose} testID="test-sheet">
          <SheetTitle>Test Sheet</SheetTitle>
        </Sheet>
      );
      const { TouchableWithoutFeedback } = require('react-native');
      const touchables = UNSAFE_getAllByType(TouchableWithoutFeedback);
      
      // First TouchableWithoutFeedback is the overlay
      const overlay = touchables[0];
      fireEvent.press(overlay);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not dismiss when content area is pressed', () => {
      const onClose = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <Sheet visible={true} onClose={onClose} testID="test-sheet">
          <SheetTitle>Test Sheet</SheetTitle>
        </Sheet>
      );
      const { TouchableWithoutFeedback } = require('react-native');
      const touchables = UNSAFE_getAllByType(TouchableWithoutFeedback);
      
      // Second TouchableWithoutFeedback is the content area
      const contentArea = touchables[1];
      fireEvent.press(contentArea);
      
      // onClose should not be called when content is pressed
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Sheet Structure', () => {
    it('renders Sheet with SheetHeader', () => {
      const { getByText } = render(
        <Sheet visible={true} onClose={jest.fn()} testID="test-sheet">
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
          </SheetHeader>
        </Sheet>
      );
      expect(getByText('Sheet Title')).toBeTruthy();
    });

    it('renders Sheet with SheetTitle', () => {
      const { getByText } = render(
        <Sheet visible={true} onClose={jest.fn()} testID="test-sheet">
          <SheetTitle>Test Title</SheetTitle>
        </Sheet>
      );
      expect(getByText('Test Title')).toBeTruthy();
    });

    it('renders Sheet with SheetDescription', () => {
      const { getByText } = render(
        <Sheet visible={true} onClose={jest.fn()} testID="test-sheet">
          <SheetDescription>Test Description</SheetDescription>
        </Sheet>
      );
      expect(getByText('Test Description')).toBeTruthy();
    });

    it('renders complete Sheet structure', () => {
      const { getByText } = render(
        <Sheet visible={true} onClose={jest.fn()} testID="test-sheet">
          <SheetHeader>
            <SheetTitle>Complete Sheet</SheetTitle>
            <SheetDescription>This is a complete sheet with all components</SheetDescription>
          </SheetHeader>
        </Sheet>
      );
      expect(getByText('Complete Sheet')).toBeTruthy();
      expect(getByText('This is a complete sheet with all components')).toBeTruthy();
    });
  });

  describe('Modal Properties', () => {
    it('uses slide animation', () => {
      const { getByTestId } = render(
        <Sheet visible={true} onClose={jest.fn()} testID="test-sheet">
          <SheetTitle>Test Sheet</SheetTitle>
        </Sheet>
      );
      const modal = getByTestId('test-sheet');
      expect(modal.props.animationType).toBe('slide');
    });

    it('is transparent', () => {
      const { getByTestId } = render(
        <Sheet visible={true} onClose={jest.fn()} testID="test-sheet">
          <SheetTitle>Test Sheet</SheetTitle>
        </Sheet>
      );
      const modal = getByTestId('test-sheet');
      expect(modal.props.transparent).toBe(true);
    });
  });

  describe('Platform-Specific Elevation', () => {
    it('applies platform-specific styles', () => {
      const { UNSAFE_getAllByType } = render(
        <Sheet visible={true} onClose={jest.fn()} testID="test-sheet">
          <SheetTitle>Test Sheet</SheetTitle>
        </Sheet>
      );
      const { View } = require('react-native');
      const views = UNSAFE_getAllByType(View);
      
      // Find the content view (should have style with elevation or shadow)
      const contentView = views.find((view: any) => {
        const style = Array.isArray(view.props.style) 
          ? view.props.style 
          : [view.props.style];
        return style.some((s: any) => 
          s?.elevation !== undefined || s?.shadowColor !== undefined
        );
      });
      expect(contentView).toBeTruthy();
    });
  });

  describe('Custom className', () => {
    it('accepts custom className prop on Sheet', () => {
      const { getByText } = render(
        <Sheet visible={true} onClose={jest.fn()} className="p-8" testID="test-sheet">
          <SheetTitle>Custom Sheet</SheetTitle>
        </Sheet>
      );
      expect(getByText('Custom Sheet')).toBeTruthy();
    });

    it('accepts custom className prop on SheetHeader', () => {
      const { getByText } = render(
        <Sheet visible={true} onClose={jest.fn()} testID="test-sheet">
          <SheetHeader className="mb-8">
            <SheetTitle>Header with Custom Class</SheetTitle>
          </SheetHeader>
        </Sheet>
      );
      expect(getByText('Header with Custom Class')).toBeTruthy();
    });

    it('accepts custom className prop on SheetTitle', () => {
      const { getByText } = render(
        <Sheet visible={true} onClose={jest.fn()} testID="test-sheet">
          <SheetTitle className="text-2xl">Large Title</SheetTitle>
        </Sheet>
      );
      expect(getByText('Large Title')).toBeTruthy();
    });

    it('accepts custom className prop on SheetDescription', () => {
      const { getByText } = render(
        <Sheet visible={true} onClose={jest.fn()} testID="test-sheet">
          <SheetDescription className="text-base">Large Description</SheetDescription>
        </Sheet>
      );
      expect(getByText('Large Description')).toBeTruthy();
    });
  });
});
