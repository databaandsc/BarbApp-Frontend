import { render } from '@testing-library/react-native';
import React from 'react';
import StatusBadge from '../StatusBadge';

// Group the tests for this component.
// Agrupamos las pruebas de este componente.
describe('StatusBadge Component', () => {

  it('renders the correct text based on the status prop', () => {
    // 1. Render the badge with a specific status.
    // 1. Renderizamos la etiqueta con un estado específico.
    const { getByText } = render(<StatusBadge status="CONFIRMED" />);

    // 2. Check that the correct status word appears.
    // 2. Comprobamos que la palabra del estado aparece correctamente.
    expect(getByText('CONFIRMED')).toBeTruthy();
  });

});
