// apiRequests.js

import axios from 'axios';

const executePythonCode = async (lang, code, dataInput) => {

  const options = {
    method: 'POST',
    url: 'https://online-code-compiler.p.rapidapi.com/v1/',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '44a9e9e889msh5af9ac4cd38f353p16fff1jsnb4364defb1bc',
      'X-RapidAPI-Host': 'online-code-compiler.p.rapidapi.com'
    },
    data: {
      language: lang,
      version: 'latest',
      code: code,
      input: dataInput
    }
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

export default executePythonCode;
