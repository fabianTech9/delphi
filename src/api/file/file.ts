const getJSONFile = async (url): Promise<any> => {
  try {
    const res = await fetch(url);

    return await res.json();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);

    return null;
  }
};

export default getJSONFile;
