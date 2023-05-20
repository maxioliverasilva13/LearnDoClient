import { useState } from "react";


const useForm = (initialValues) => {

    const [formValues, setFormValues] = useState(initialValues);

    const handleChangeValue = (key, value) => {
        setFormValues({
            ...formValues,
            [key]: value,
        })
    }

    const handleChangeValueMultipleValues = (key, value, key2, value2) => {
        setFormValues({
            ...formValues,
            [key]: value,
            [key2]: value2,
        })
    }

    return {
        formValues,
        handleChangeValue,
        handleChangeValueMultipleValues,
    }
}

export default useForm;