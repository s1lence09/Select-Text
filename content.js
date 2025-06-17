// Load Tesseract OCR library
const tesseractScript = document.createElement('script');
tesseractScript.src = "https://cdn.jsdelivr.net/npm/tesseract.js@2/dist/tesseract.min.js";
document.head.appendChild(tesseractScript);

const injectButton = (video) => {
  if (video.dataset.vidtextAttached) return; // Avoid duplicate

    video.dataset.vidtextAttached = true;

      const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
          video.parentNode.insertBefore(wrapper, video);
            wrapper.appendChild(video);

              const btn = document.createElement("button");
                btn.innerText = "Copy Text";
                  btn.className = "copy-text-btn";

                    btn.onclick = async () => {
                        const canvas = document.createElement("canvas");
                            canvas.width = video.videoWidth;
                                canvas.height = video.videoHeight;

                                    const ctx = canvas.getContext("2d");
                                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                                            const blob = await new Promise(res => canvas.toBlob(res, "image/png"));
                                                
                                                    if (!window.Tesseract) return alert("Tesseract not loaded. Try again in a few seconds.");

                                                        const { data: { text } } = await Tesseract.recognize(blob, 'eng', {
                                                              logger: m => console.log(m)
                                                                  });

                                                                      if (text && text.trim()) {
                                                                            await navigator.clipboard.writeText(text);
                                                                                  alert("✅ VidText Copy: Text copied to clipboard!\n\n" + text.trim().slice(0, 300));
                                                                                      } else {
                                                                                            alert("❌ VidText Copy: No readable text found.");
                                                                                                }
                                                                                                  };

                                                                                                    wrapper.appendChild(btn);
                                                                                                    };

                                                                                                    const observeVideos = () => {
                                                                                                      const videos = document.querySelectorAll("video");
                                                                                                        videos.forEach(video => injectButton(video));

                                                                                                          const observer = new MutationObserver(() => {
                                                                                                              document.querySelectorAll("video").forEach(video => injectButton(video));
                                                                                                                });

                                                                                                                  observer.observe(document.body, { childList: true, subtree: true });
                                                                                                                  };

                                                                                                                  document.addEventListener("DOMContentLoaded", observeVideos);
                                                                                                                  setTimeout(observeVideos, 2000);