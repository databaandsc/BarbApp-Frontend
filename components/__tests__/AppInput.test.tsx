import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { AppInput } from '../AppInput';

// Group the tests for this component.
// Agrupamos las pruebas de este componente.
describe('AppInput Component', () => {

  it('renders correctly with given placeholder', () => {
    // 1. Render the input component.
    // 1. Renderizamos el componente de entrada de texto.
    const { getByPlaceholderText } = render(
      <AppInput placeholder="Email" value="" onChangeText={() => {}} />
    );

    // 2. Check if the element appears on the screen.
    // 2. Comprobamos si el elemento aparece en la pantalla.
    expect(getByPlaceholderText('Email')).toBeTruthy();
  });

  it('calls onChangeText when the user types', () => {
    // 1. Create a spy function to detect changes.
    // 1. Creamos una función espía para detectar los cambios.
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <AppInput placeholder="Password" value="" onChangeText={mockOnChangeText} />
    );

    // 2. Simulate user typing inside the input.
    // 2. Simulamos que el usuario escribe dentro del campo.
    fireEvent.changeText(getByPlaceholderText('Password'), 'hola123');

    // 3. Verify that the function was called with the correct text.
    // 3. Verificamos que la función ha sido llamada con el texto correcto.
    expect(mockOnChangeText).toHaveBeenCalledWith('hola123');
  });

});
