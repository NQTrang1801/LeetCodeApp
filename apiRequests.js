import axios from 'axios';
import { encode as base64Encode, decode as base64Decode } from 'base-64';
const checkStatus = async (token) => {
  const options = {
    method: "GET",
    url: 'https://judge0-extra-ce.p.rapidapi.com/submissions' + "/" + token,
    params: { base64_encoded: "true", fields: "*" },
    headers: {
      'X-RapidAPI-Host': 'judge0-extra-ce.p.rapidapi.com',
      'X-RapidAPI-Key': '44a9e9e889msh5af9ac4cd38f353p16fff1jsnb4364defb1bc',
    },
  };
  try {
    let response = await axios.request(options);
    let statusId = response.data.status?.id;
    if (statusId === 1 || statusId === 2) {
      setTimeout(() => {
        checkStatus(token)
      }, 2000)
      return
    } else {
      const stdoutValue = response.data.stdout;
      const decodedStdout = base64Decode(stdoutValue);
      const descriptionValue = response.data.status.description;
      console.log(descriptionValue + ": " + decodedStdout);

      return response.data;
    }
  } catch (err) {
    console.log("err", err);
  }
};

const executePythonCode = async (lang, code, dataInput) => {
  try {
    const formData = {
      language_id: 28,
      source_code: base64Encode(code),
      stdin: base64Encode(dataInput),
    };
    const options = {
      method: 'POST',
      url: 'https://judge0-extra-ce.p.rapidapi.com/submissions',
      params: { base64_encoded: true, fields: '*' },
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Host': 'judge0-extra-ce.p.rapidapi.com',
        'X-RapidAPI-Key': '44a9e9e889msh5af9ac4cd38f353p16fff1jsnb4364defb1bc',
      },
      data: formData,
    };

    const response = await axios.request(options);
    const token = response.data.token;
    return checkStatus(token);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default executePythonCode;
