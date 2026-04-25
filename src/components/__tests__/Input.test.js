import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';

describe('Input Component', () => {
  it('renders the placeholder correctly', () => {
    const { getByPlaceholderText } = render(<Input placeholder="Enter email" />);
    expect(getByPlaceholderText('Enter email')).toBeTruthy();
  });

  it('handles text input changes correctly', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Type here" onChangeText={mockOnChangeText} />
    );
    
    const input = getByPlaceholderText('Type here');
    fireEvent.changeText(input, 'Hello World');
    
    expect(mockOnChangeText).toHaveBeenCalledWith('Hello World');
  });

  it('renders the icon if provided', () => {
    const { getByText } = render(
      <Input placeholder="With Icon" icon={<Text>🔍</Text>} />
    );
    expect(getByText('🔍')).toBeTruthy();
  });
});
