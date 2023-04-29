import { useState } from "react";


const useForm = (initialValues) => {

    const [formValues, setFormValues] = useState(initialValues);

    const handleChangeValue = (key, value) => {
        setFormValues({
            ...formValues,
            [key]: value,
        })
    }

    return {
        formValues,
        handleChangeValue,
    }
}

export default useForm;