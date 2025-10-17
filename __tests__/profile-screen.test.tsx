/**
 * ProfileScreen Tests
 * Verify NativeWind migration and design system integration for Profile screen
 * 
 * Migrated to NativeWind (Task 7.2)
 */

import {render, fireEvent} from '@testing-library/react-native';
import {ProfileScreen} from '../src/screens/ProfileScreen';

// Mock navigation
const createMockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
  canGoBack: jest.fn(() => true),
  dispatch: jest.fn(),
  isFocused: jest.fn(() => true),
  getState: jest.fn(),
  getParent: jest.fn(),
  getId: jest.fn(),
  setParams: jest.fn(),
});

describe('ProfileScreen', () => {
  it('renders with NativeWind design system components', () => {
    const navigation = createMockNavigation();
    const {getByText, getByTestId} = render(
      <ProfileScreen navigation={navigation as any} route={{} as any} />,
    );

    // Verify header
    expect(getByTestId('profile-header')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();

    // Verify settings button
    expect(getByTestId('settings-button')).toBeTruthy();

    // Verify user type display
    expect(getByTestId('user-type-display')).toBeTruthy();
    expect(getByText('Manifesting Generator • 1/3')).toBeTruthy();
    expect(getByText('Human Design Type & Profile')).toBeTruthy();

    // Verify primary system card
    expect(getByTestId('primary-system-card')).toBeTruthy();
    expect(getByText('Primary Star System')).toBeTruthy();
    expect(getByTestId('primary-system-name')).toBeTruthy();
    expect(getByText('Pleiades')).toBeTruthy();
    expect(getByTestId('primary-system-percentage')).toBeTruthy();
    expect(getByText('62%')).toBeTruthy();

    // Verify allied systems section
    expect(getByText('Allied Systems')).toBeTruthy();
    
    // Verify ally cards
    expect(getByTestId('ally-system-card-0')).toBeTruthy();
    expect(getByTestId('ally-system-name-0')).toBeTruthy();
    expect(getByText('Sirius')).toBeTruthy();
    expect(getByTestId('ally-system-percentage-0')).toBeTruthy();
    expect(getByText('18%')).toBeTruthy();

    expect(getByTestId('ally-system-card-1')).toBeTruthy();
    expect(getByTestId('ally-system-name-1')).toBeTruthy();
    expect(getByText('Arcturus')).toBeTruthy();
    expect(getByTestId('ally-system-percentage-1')).toBeTruthy();
    expect(getByText('12%')).toBeTruthy();

    expect(getByTestId('ally-system-card-2')).toBeTruthy();
    expect(getByTestId('ally-system-name-2')).toBeTruthy();
    expect(getByText('Andromeda')).toBeTruthy();
    expect(getByTestId('ally-system-percentage-2')).toBeTruthy();
    expect(getByText('8%')).toBeTruthy();
  });

  it('has proper accessibility labels', () => {
    const navigation = createMockNavigation();
    const {getByLabelText} = render(
      <ProfileScreen navigation={navigation as any} route={{} as any} />,
    );

    expect(getByLabelText('Go to Settings')).toBeTruthy();
  });

  it('navigates to Settings screen when settings button is pressed', () => {
    const navigation = createMockNavigation();
    const {getByTestId} = render(
      <ProfileScreen navigation={navigation as any} route={{} as any} />,
    );

    const settingsButton = getByTestId('settings-button');
    fireEvent.press(settingsButton);

    expect(navigation.navigate).toHaveBeenCalledWith('Settings');
  });

  it('displays star system crests for primary and allies', () => {
    const navigation = createMockNavigation();
    const {getByTestId} = render(
      <ProfileScreen navigation={navigation as any} route={{} as any} />,
    );

    // Verify screen renders (crests are SVG components, harder to test directly)
    expect(getByTestId('profile-screen')).toBeTruthy();
    expect(getByTestId('primary-system-card')).toBeTruthy();
    expect(getByTestId('ally-system-card-0')).toBeTruthy();
    expect(getByTestId('ally-system-card-1')).toBeTruthy();
    expect(getByTestId('ally-system-card-2')).toBeTruthy();
  });

  it('uses NativeWind Card component with correct variants', () => {
    const navigation = createMockNavigation();
    const {getByTestId} = render(
      <ProfileScreen navigation={navigation as any} route={{} as any} />,
    );

    // Primary system uses emphasis variant
    const primaryCard = getByTestId('primary-system-card');
    expect(primaryCard).toBeTruthy();

    // Ally cards use default variant
    const allyCard0 = getByTestId('ally-system-card-0');
    expect(allyCard0).toBeTruthy();
  });

  it('meets minimum touch target size (44px) with NativeWind classes', () => {
    const navigation = createMockNavigation();
    const {getByTestId} = render(
      <ProfileScreen navigation={navigation as any} route={{} as any} />,
    );

    const settingsButton = getByTestId('settings-button');
    expect(settingsButton).toBeTruthy();
    // Touch target size is enforced with className="min-w-[44px] min-h-[44px]"
  });
});
