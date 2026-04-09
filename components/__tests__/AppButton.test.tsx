import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { AppButton } from '../AppButton';

// Group the tests for this component.
// Agrupamos las pruebas de este componente.
describe('AppButton Component', () => {
    
  it('renders correctly with the provided text', () => {
    // 1. Render the button.
    // 1. Renderizamos el botón.
    const { getByText } = render(<AppButton text="Iniciar Sesión" onPress={() => {}} />);
    
    // 2. Check that the text appears on the screen.
    // 2. Comprobamos que el texto aparece en la pantalla.
    expect(getByText('Iniciar Sesión')).toBeTruthy();
  });

  it('executes the onPress function when the user clicks', () => {
    // 1. Create a fake spy function.
    // 1. Creamos una función espía falsa.
    const mockOnPress = jest.fn();
    const { getByText } = render(<AppButton text="Click Me" onPress={mockOnPress} />);
    
    // 2. Simulate the user pressing the button.
    // 2. Simulamos que el usuario pulsa el botón.
    fireEvent.press(getByText('Click Me'));
    
    // 3. Check that the spy function has been called 1 time.
    // 3. Comprobamos que la función espía ha sido llamada 1 vez.
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not show text and disables click when loading', () => {
    const mockOnPress = jest.fn();
    const { queryByText } = render(<AppButton text="Procesando" onPress={mockOnPress} loading={true} />);
    
    // Since it goes into loading state, the text should NOT appear .
    // Como está cargando, el texto NO debería aparecer .
    expect(queryByText('Procesando')).toBeNull();
  });

});
