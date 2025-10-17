/**
 * EmptyStatesScreen Tests
 * Tests for empty states and error handling patterns
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { EmptyStatesScreen } from '../src/screens/EmptyStatesScreen';
import { ThemeProvider } from '../src/theme/ThemeProvider';

// Wrapper with ThemeProvider
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('EmptyStatesScreen', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    renderWithTheme(<EmptyStatesScreen onBack={mockOnBack} />);
    
    expect(screen.getByTestId('empty-states-screen')).toBeTruthy();
    expect(screen.getByTestId('empty-states-app-bar')).toBeTruthy();
  });

  it('displays app bar with title and back button', () => {
    renderWithTheme(<EmptyStatesScreen onBack={mockOnBack} />);
    
    expect(screen.getByText('Empty States & Errors')).toBeTruthy();
    expect(screen.getByTestId('empty-states-app-bar-back')).toBeTruthy();
  });

  it('calls onBack when back button is pressed', () => {
    renderWithTheme(<EmptyStatesScreen onBack={mockOnBack} />);
    
    const backButton = screen.getByTestId('empty-states-app-bar-back');
    fireEvent.press(backButton);
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  describe('Empty States', () => {
    it('renders "No Chart Yet" empty state', () => {
      renderWithTheme(<EmptyStatesScreen onBack={mockOnBack} />);
      
      expect(screen.getByTestId('empty-state-no-chart')).toBeTruthy();
      expect(screen.getByText('No Chart Yet')).toBeTruthy();
      expect(screen.getByText(/Enter your birth data to compute/)).toBeTruthy();
      expect(screen.getByText('Begin Sorting')).toBeTruthy();
    });

    it('renders "Connection Lost" error state', () => {
      renderWithTheme(<EmptyStatesScreen onBack={mockOnBack} />);
      
      expect(screen.getByTestId('empty-state-network-error')).toBeTruthy();
      expect(screen.getByText('Connection Lost')).toBeTruthy();
      expect(screen.getByText(/Unable to sync with cloud/)).toBeTruthy();
      expect(screen.getByText('Retry')).toBeTruthy();
    });

    it('renders "Invalid Chart Data" error state', () => {
      renderWithTheme(<EmptyStatesScreen onBack={mockOnBack} />);
      
      expect(screen.getByTestId('empty-state-invalid-data')).toBeTruthy();
      expect(screen.getByText('Invalid Chart Data')).toBeTruthy();
      expect(screen.getByText(/We couldn't process your chart/)).toBeTruthy();
      expect(screen.getByText('Edit Details')).toBeTruthy();
    });

    it('renders "No Posts Yet" empty state', () => {
      renderWithTheme(<EmptyStatesScreen onBack={mockOnBack} />);
      
      expect(screen.getByTestId('empty-state-no-posts')).toBeTruthy();
      expect(screen.getByText('No Posts Yet')).toBeTruthy();
      expect(screen.getByText(/Your star system community/)).toBeTruthy();
      expect(screen.getByText('Create Post')).toBeTruthy();
    });
  });

  describe('Inline Alerts', () => {
    it('renders all inline alert types', () => {
      renderWithTheme(<EmptyStatesScreen onBack={mockOnBack} />);
      
      expect(screen.getByTestId('inline-alert-error')).toBeTruthy();
      expect(screen.getByTestId('inline-alert-warning')).toBeTruthy();
      expect(screen.getByTestId('inline-alert-info')).toBeTruthy();
      expect(screen.getByTestId('inline-alert-success')).toBeTruthy();
    });

    it('displays error alert message', () => {
      renderWithTheme(<EmptyStatesScreen onBack={mockOnBack} />);
      
      expect(screen.getByText(/Failed to generate narrative/)).toBeTruthy();
    });

    it('displays warning alert message', () => {
      renderWithTheme(<EmptyStatesScreen onBack={mockOnBack} />);
      
      expect(screen.getByText(/Your subscription expires in 3 days/)).toBeTruthy();
    });

    it('displays info alert message', () => {
      renderWithTheme(<EmptyStatesScreen onBack={mockOnBack} />);
      
      expect(screen.getByText(/New quest available/)).toBeTruthy();
    });

    it('displays success alert message', () => {
      renderWithTheme(<EmptyStatesScreen onBack={mockOnBack} />);
      
      expect(screen.getByText(/Chart successfully computed/)).toBeTruthy();
    });
  });

  describe('Disclaimer', () => {
    it('renders disclaimer section', () => {
      renderWithTheme(<EmptyStatesScreen onBack={mockOnBack} />);
      
      expect(screen.getByText('Disclaimer Example')).toBeTruthy();
      expect(screen.getByText(/For insight & entertainment/)).toBeTruthy();
    });

    it('displays correct disclaimer text', () => {
      renderWithTheme(<EmptyStatesScreen onBack={mockOnBack} />);
      
      const disclaimerText = screen.getByText(/For insight & entertainment/);
      expect(disclaimerText.props.children).toBe(
        'For insight & entertainment. Not medical, financial, or legal advice.'
      );
    });
  });

  describe('Accessibility', () => {
    it('has accessible back button', () => {
      renderWithTheme(<EmptyStatesScreen onBack={mockOnBack} />);
      
      const backButton = screen.getByTestId('empty-states-app-bar-back');
      expect(backButton.props.accessibilityRole).toBe('button');
      expect(backButton.props.accessibilityLabel).toBe('Go back');
    });

    it('has accessible action buttons', () => {
      renderWithTheme(<EmptyStatesScreen onBack={mockOnBack} />);
      
      // Check that action buttons exist and are accessible
      const beginButton = screen.getByText('Begin Sorting');
      expect(beginButton).toBeTruthy();
      
      // Verify the button is within a touchable component
      let currentNode = beginButton.parent;
      let foundButton = false;
      while (currentNode && !foundButton) {
        if (currentNode.props.accessibilityRole === 'button') {
          foundButton = true;
        }
        currentNode = currentNode.parent;
      }
      expect(foundButton).toBe(true);
    });
  });

  describe('Starfield Background', () => {
    it('renders starfield background', () => {
      renderWithTheme(<EmptyStatesScreen onBack={mockOnBack} />);
      
      expect(screen.getByTestId('starfield-background')).toBeTruthy();
    });
  });
});
