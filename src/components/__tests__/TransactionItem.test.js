import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TransactionItem } from '../TransactionItem';

describe('TransactionItem Component', () => {
  it('renders transaction details correctly', () => {
    const { getByText } = render(
      <TransactionItem 
        title="Groceries" 
        date="Oct 24, 2023" 
        amount="500" 
        type="expense" 
      />
    );
    
    expect(getByText('Groceries')).toBeTruthy();
    expect(getByText('Oct 24, 2023')).toBeTruthy();
    expect(getByText('-₹500')).toBeTruthy();
  });

  it('formats income amounts with a plus sign', () => {
    const { getByText } = render(
      <TransactionItem 
        title="Salary" 
        date="Oct 24, 2023" 
        amount="50000" 
        type="income" 
        currencySymbol="$"
      />
    );
    
    expect(getByText('+$50000')).toBeTruthy();
  });

  it('calls onPress when the item is tapped', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <TransactionItem 
        title="Food" 
        date="Oct 24" 
        amount="100" 
        type="expense" 
        onPress={mockPress} 
      />
    );
    
    fireEvent.press(getByText('Food'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });
});
