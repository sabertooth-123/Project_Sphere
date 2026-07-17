export async function uploadCoverImage(file: File): Promise<string> {
  const signRes = await fetch("/api/uploads/sign", { method: "POST" });
  if (!signRes.ok) throw new Error("Could not get upload signature");
  const { signature, timestamp, folder, apiKey, cloudName } = await signRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) throw new Error("Image upload failed");
  const data = await uploadRes.json();
  return data.secure_url as string;
}
