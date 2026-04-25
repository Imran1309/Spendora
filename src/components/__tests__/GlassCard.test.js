import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { GlassCard } from '../GlassCard';

describe('GlassCard Component', () => {
  it('renders its children correctly', () => {
    const { getByText } = render(
      <GlassCard>
        <Text>Inner Content</Text>
      </GlassCard>
    );
    
    expect(getByText('Inner Content')).toBeTruthy();
  });
});
