import * as yup from "yup";

const schema = yup.object().shape({
    card_name: yup.string().required()
        .max(16,"El número de tarjeta no puede superar los 16 digitos"),
    cvv: yup.string().required(),
    expiration_month: yup.number().required()
        .min(1, "El mes de expiración debe ser válido")
        .max(12, "El mes de expiración debe ser válido"),
    expiration_year: yup.number().required()
        .min(2022, "El año de expiración debe ser mayor o igual a 2022")
        .max(2027, "El año de expiración debe ser menor o igual a 2027"),
    email: yup.string().required()
        .matches(/(^\w+([\.-]?\w+)*@\yahoo.es|^\w+([\.-]?\w+)*@\hotmail.com|^\w+([\.-]?\w+)*@\gmail.com)/,"Email no válido")
  });

  export { schema }

