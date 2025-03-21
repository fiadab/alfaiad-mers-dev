async function edgeStoreUpload(file: File) {
  try {
    const response = await fetch("https://upload.edgestore.dev/api/v1/upload", {
      method: "POST",
      body: file,
      headers: {
        "Authorization": `Bearer ${process.env.EDGE_STORE_ACCESS_KEY}`,
      },
    });

    if (!response.ok) throw new Error("Upload failed");

    const data = await response.json();
    return { url: `/${data.url.split('/').pop()}` };

  } catch (error) {
    throw new Error('Failed to upload file');
  }
};
