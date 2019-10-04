import React from 'react';
import styled from 'styled-components';

interface CounterProps {
  length: number;
  increment: () => void;
}

const Counter = ({ increment, length }: CounterProps) => (
  <>
    <CustomAnchor onClick={increment}>Add Item</CustomAnchor>
    <FlexWrapper>
      {Array.from({ length }).map((_, key) => (
        <FlexItem key={key}>{key}</FlexItem>
      ))}
    </FlexWrapper>
  </>
);

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 300px;
`;

const FlexItem = styled.div`
  width: 15px;
  height: 15px;
  margin: 5px;
`;

const CustomAnchor = styled.a`
  display: block;
  border-radius: 4px;
  padding: 20px;
`;

export default Counter;
