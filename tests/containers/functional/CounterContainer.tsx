import React, { useState, useMemo, useEffect } from 'react';
import Counter from '../../components/functional/Counter';

interface CounterContainerProps {
  setDozen: (dozen: number) => void;
}

const CounterContainer = ({ setDozen }: CounterContainerProps) => {
  const [length, setLength] = useState(0);
  const { increment } = useMemo(() => {
    const increment = () => setLength(l => ++l);
    return { increment };
  }, []);

  const dozen = Math.floor(length / 12);
  useEffect(() => {
    setDozen(dozen);
  }, [dozen]); // eslint-disable-line react-hooks/exhaustive-deps

  return <Counter length={length} increment={increment} />;
};

export default CounterContainer;
