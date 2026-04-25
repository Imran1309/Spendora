import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GradientButton } from '../GradientButton';

describe('GradientButton Component', () => {
  it('renders correctly with given title', () => {
    const { getByText } = render(<GradientButton title="Submit" onPress={() => {}} />);
    expect(getByText('Submit')).toBeTruthy();
  });

  it('calls onPress function when tapped', () => {
    const mockPress = jest.fn();
    const { getByText } = render(<GradientButton title="Tap Me" onPress={mockPress} />);
    
    const button = getByText('Tap Me');
    fireEvent.press(button);
    
    expect(mockPress).toHaveBeenCalledTimes(1);
  });
});
