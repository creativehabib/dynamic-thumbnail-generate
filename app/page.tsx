'use client';

import { useState, useRef, useCallback, ChangeEvent, useEffect } from 'react';
// html-to-image ইম্পোর্টটি সরানো হয়েছে, আমরা এটি CDN থেকে লোড করবো
// import { toPng } from 'html-to-image';

type HtmlToImageMethods = {
  toPng: (node: HTMLElement, options?: unknown) => Promise<string>;
  toJpeg: (node: HTMLElement, options?: unknown) => Promise<string>;
  toWebp: (node: HTMLElement, options?: unknown) => Promise<string>;
};

type HtmlToImageWindow = typeof window & { htmlToImage?: HtmlToImageMethods };

export default function Home() {
  // === স্টেট ভ্যারিয়েবল ===
  const [logo, setLogo] = useState<string>('/logo.png');
  const [line1, setLine1] = useState<string>('বাংলাদেশ উন্মুক্ত বিশ্ববিদ্যালয়ে');
  const [line2, setLine2] = useState<string>('নিয়োগ বিজ্ঞপ্তি');
  const [line3, setLine3] = useState<string>('পরীক্ষার তারিখ ও ফলাফল');
  const [sideText, setSideText] = useState<string>('www.ebdresults.com');
  const [shapeColor, setShapeColor] = useState<string>('#B91C1C');

  // --- টেক্সট স্টেট ---
  const [textColor1, setTextColor1] = useState<string>('#FFFFFF');
  const [textColor2, setTextColor2] = useState<string>('#FFFFFF');
  const [textColor3, setTextColor3] = useState<string>('#FFFFFF');
  const [showLine2Bg, setShowLine2Bg] = useState<boolean>(true);
  const [showLine3Bg, setShowLine3Bg] = useState<boolean>(true);

  // --- নতুন স্টেট (লাইন ১ রাউন্ডেড) ---
  const [line1BorderRadius, setLine1BorderRadius] = useState<number>(8);

  const [sideTextColor, setSideTextColor] = useState<string>('#FFFFFF');
  const [flowerImage, setFlowerImage] = useState<string>('/flower.png');
  const [footerLogo, setFooterLogo] = useState<string>('/footer-logo.png');

  // --- নতুন স্টেট (ফুটার লোগো) ---
  const [showFooterLogoBg, setShowFooterLogoBg] = useState<boolean>(false);
  const [footerLogoBgColor, setFooterLogoBgColor] = useState<string>('#FFFFFF');
  const [footerLogoBorderRadius, setFooterLogoBorderRadius] = useState<number>(8);

  const [contentY, setContentY] = useState<number>(0);
  const [bgColor, setBgColor] = useState<string>('#3a55df');
  const [waveColor1, setWaveColor1] = useState<string>('#d6dbdf');
  const [waveColor2, setWaveColor2] = useState<string>('#abb2b9');
  const [logoSize, setLogoSize] = useState<number>(100);
  const [logoMarginBottom, setLogoMarginBottom] = useState<number>(16);
  const [sideTextX, setSideTextX] = useState<number>(0);
  const [imageQuality, setImageQuality] = useState<string>('Medium');
  // --- নতুন স্টেট (ইমেজ ফরম্যাট) ---
  const [imageFormat, setImageFormat] = useState<string>('png');
  const [fontFamily, setFontFamily] = useState<string>('var(--font-hind-siliguri)');

  // --- নতুন স্টেট ---
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);
  // --- /নতুন স্টেট ---


  const thumbnailRef = useRef<HTMLDivElement>(null);

  // === স্ক্রিপ্ট লোডার ===
  useEffect(() => {
    // --- পরিবর্তন শুরু ---
    // 'dom-to-image-more' থেকে 'html-to-image'-এ পরিবর্তন
    const script = document.createElement('script');
    // CDN 'jsdelivr' থেকে 'html-to-image' লোড করা
    script.src = 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.min.js';
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'no-referrer';
    // --- পরিবর্তন শেষ ---

    // স্ক্রিপ্ট সফলভাবে লোড হলে
    script.onload = () => {
    // --- পরিবর্তন: 'domtoimage' এর পরিবর্তে 'htmlToImage' অবজেক্টটি আছে কিনা তা পরীক্ষা করুন ---
    const htmlToImage = (window as HtmlToImageWindow).htmlToImage;
    if (htmlToImage) {
      console.log('html-to-image script loaded successfully from jsdelivr.');
      setIsScriptLoaded(true);
    } else {
        console.error('Script loaded, but window.htmlToImage is not defined.');
        console.error('Could not initialize image generation script. Download will not work.');
      }
    };

    // স্ক্রিপ্ট লোড ব্যর্থ হলে
    script.onerror = () => {
      console.error('Failed to load html-to-image script from jsdelivr.');
      console.error('Could not load image generation script. Download will not work.');
    };

    // স্ক্রিপ্টটি document body-তে যোগ করুন
    document.body.appendChild(script);

    // কম্পোনেন্ট আনমাউন্ট হলে স্ক্রিপ্টটি পরিষ্কার করুন
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []); // খালি dependency array মানে এটি শুধু একবার মাউন্ট করার সময় চলবে

  // === (এই ফাংশনটি Base64 কনভার্ট করে) ===
  const handleImageUpload = (
      e: ChangeEvent<HTMLInputElement>,
      setImage: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resizeDataUrlIfNeeded = useCallback((
      dataUrl: string,
      targetExtension: string
  ): Promise<string> => {
    const MAX_WIDTH = 1200;
    const MAX_HEIGHT = 680;
    const mimeType =
        targetExtension === 'jpg'
            ? 'image/jpeg'
            : targetExtension === 'png'
                ? 'image/png'
                : 'image/webp';

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const { width, height } = img;

        if (width <= MAX_WIDTH && height <= MAX_HEIGHT) {
          resolve(dataUrl);
          return;
        }

        const scale = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(width * scale);
        canvas.height = Math.floor(height * scale);
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL(mimeType));
      };

      img.onerror = () => reject(new Error('Failed to load generated image'));
      img.src = dataUrl;
    });
  }, []);

  // === (এই ফাংশনটি ডাউনলোড করে - কোয়ালিটি অপশন সহ) ===
  const onDownload = useCallback(() => {
    // স্ক্রিপ্ট লোড না হলে বা ref না থাকলে ডাউনলোড শুরু করবেন না
    if (thumbnailRef.current === null) {
      console.error('Thumbnail ref is not available.');
      return;
    }

    // --- পরিবর্তন: 'domtoimage' এর পরিবর্তে 'htmlToImage' চেক করুন ---
    const htmlToImage = (window as HtmlToImageWindow).htmlToImage;
    if (!isScriptLoaded || !htmlToImage) {
      console.error('html-to-image script is not loaded yet.');
      alert('ইমেজ তৈরির স্ক্রিপ্ট এখনও লোড হয়নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।');
      return;
    }

    let pixelRatioValue = 1.5;
    if (imageQuality === 'Low') {
      pixelRatioValue = 1;
    } else if (imageQuality === 'High') {
      pixelRatioValue = 2;
    }

    const options = {
      cacheBust: true,
      quality: 1.0, // JPG/WEBP-এর জন্য 1.0 সর্বোচ্চ কোয়ালিটি
      pixelRatio: pixelRatioValue
    };

    // --- ফরম্যাট নির্বাচনের জন্য নতুন লজিক ---
    // --- পরিবর্তন: 'domtoimage' এর পরিবর্তে 'htmlToImage' ব্যবহার করুন ---
    const downloader = htmlToImage;
    let downloadPromise: Promise<string>;
    let fileExtension = imageFormat; // 'png', 'jpeg', 'webp'

    if (imageFormat === 'png') {
      downloadPromise = downloader.toPng(thumbnailRef.current, options);
    } else if (imageFormat === 'jpeg') {
      downloadPromise = downloader.toJpeg(thumbnailRef.current, options);
      fileExtension = 'jpg'; // .jpg এক্সটেনশন ব্যবহার করুন
    } else if (imageFormat === 'webp') {
      downloadPromise = downloader.toWebp(thumbnailRef.current, options);
    } else {
      console.error('Unknown image format:', imageFormat);
      alert('অজানা ইমেজ ফরম্যাট সিলেক্ট করা হয়েছে।');
      return;
    }
    // --- নতুন লজিক শেষ ---

    downloadPromise
        .then((dataUrl: string) => {
          return resizeDataUrlIfNeeded(dataUrl, fileExtension)
              .then((processedUrl) => {
                const link = document.createElement('a');
                link.download = `dynamic-thumbnail.${fileExtension}`; // <-- আপডেটেড ফাইল এক্সটেনশন
                link.href = processedUrl;
                link.click();
              });
        })
          .catch((err: unknown) => {
            console.error('oops, something went wrong!', err);
            alert('দুঃখিত, ডাউনলোড করা সম্ভব হয়নি। অনুগ্রহ করে কনসোল চেক করুন।');
          });
  }, [thumbnailRef, imageQuality, isScriptLoaded, imageFormat, resizeDataUrlIfNeeded]); // <-- imageFormat-কে dependency-তে যোগ করুন

  // ইনপুট স্টাইল
  const inputStyle = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900";
  const labelStyle = "block text-sm font-medium text-gray-700";
  const fileInputStyle = "mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100";
  const checkboxLabelStyle = "ml-2 block text-sm text-gray-900";
  const checkboxInputStyle = "h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500";


  return (
      // === (এই <main> ট্যাগটি ডিফল্টরূপে flex-col (মোবাইল) এবং lg:flex-row (ডেস্কটপ) তে সেট করা আছে) ===
      <main className="flex min-h-screen flex-col lg:flex-row items-start justify-center gap-10 p-8 bg-gray-100 font-sans">
        {/* বাম দিকে কন্ট্রোল প্যানেল */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-lg sticky top-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Customize Your Thumbnail
          </h2>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {/* ফন্ট সিলেক্ট মেনু */}
            <div>
              <label className={labelStyle}>বাংলা ফন্ট</label>
              <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className={inputStyle}
              >
                <option value="var(--font-hind-siliguri)">Hind Siliguri (Sans-serif)</option>
                <option value="var(--font-tiro-bangla)">Tiro Bangla (Serif)</option>
                <option value="var(--font-baloo-da-2)">Baloo Da 2 (Rounded)</option>
              </select>
            </div>

            {/* টেক্সট ইনপুট */}
            <div>
              <label className={labelStyle}>প্রথম লাইন</label>
              <input type="text" value={line1} onChange={(e) => setLine1(e.target.value)} className={inputStyle} />
              {/* --- নতুন স্লাইডার (লাইন ১ রাউন্ডেড) --- */}
              <label className={`${labelStyle} flex justify-between mt-2`}>
                <span>শেপ রাউন্ডেড</span>
                <span className="font-bold text-gray-600">{line1BorderRadius}px</span>
              </label>
              <input
                  type="range"
                  min="0"
                  max="50"
                  value={line1BorderRadius}
                  onChange={(e) => setLine1BorderRadius(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
              />
            </div>
            <div>
              <label className={labelStyle}>দ্বিতীয় লাইন</label>
              <input type="text" value={line2} onChange={(e) => setLine2(e.target.value)} className={inputStyle} />
              {/* নতুন চেকবক্স */}
              <div className="mt-2 flex items-center">
                <input
                    id="showLine2Bg"
                    type="checkbox"
                    checked={showLine2Bg}
                    onChange={(e) => setShowLine2Bg(e.target.checked)}
                    className={checkboxInputStyle}
                />
                <label htmlFor="showLine2Bg" className={checkboxLabelStyle}>
                  দ্বিতীয় লাইনের ব্যাকগ্রাউন্ড দেখান
                </label>
              </div>
            </div>
            <div>
              <label className={labelStyle}>তৃতীয় লাইন</label>
              <input type="text" value={line3} onChange={(e) => setLine3(e.target.value)} className={inputStyle} />
              {/* নতুন চেকবক্স */}
              <div className="mt-2 flex items-center">
                <input
                    id="showLine3Bg"
                    type="checkbox"
                    checked={showLine3Bg}
                    onChange={(e) => setShowLine3Bg(e.target.checked)}
                    className={checkboxInputStyle}
                />
                <label htmlFor="showLine3Bg" className={checkboxLabelStyle}>
                  তৃতীয় লাইনের ব্যাকগ্রাউন্ড দেখান
                </label>
              </div>
            </div>
            <div>
              <label className={labelStyle}>সাইড টেক্সট (বাম দিকে)</label>
              <input type="text" value={sideText} onChange={(e) => setSideText(e.target.value)} className={inputStyle} />
            </div>

            {/* কন্টেন্ট পজিশন স্লাইডার */}
            <div>
              <label className={`${labelStyle} flex justify-between`}>
                <span>কন্টেন্ট পজিশন (উপরে/নিচে)</span>
                <span className="font-bold text-gray-600">{contentY}px</span>
              </label>
              <input
                  type="range"
                  min="-100"
                  max="200"
                  value={contentY}
                  onChange={(e) => setContentY(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
              />
            </div>

            {/* লোগো কন্ট্রোল স্লাইডার */}
            <div>
              <label className={`${labelStyle} flex justify-between`}>
                <span>লোগোর সাইজ</span>
                <span className="font-bold text-gray-600">{logoSize}px</span>
              </label>
              <input
                  type="range"
                  min="50"
                  max="250"
                  value={logoSize}
                  onChange={(e) => setLogoSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
              />
            </div>
            <div>
              <label className={`${labelStyle} flex justify-between`}>
                <span>লোগোর নিচের মার্জিন</span>
                <span className="font-bold text-gray-600">{logoMarginBottom}px</span>
              </label>
              <input
                  type="range"
                  min="0"
                  max="100"
                  value={logoMarginBottom}
                  onChange={(e) => setLogoMarginBottom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
              />
            </div>

            {/* সাইড টেক্সট পজিশন স্লাইডার */}
            <div>
              <label className={`${labelStyle} flex justify-between`}>
                <span>সাইড টেক্সট (বামে/ডানে)</span>
                <span className="font-bold text-gray-600">{sideTextX}px</span>
              </label>
              <input
                  type="range"
                  min="0"
                  max="200"
                  value={sideTextX}
                  onChange={(e) => setSideTextX(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
              />
            </div>

            {/* কোয়ালিটি সিলেক্ট মেনু */}
            <div>
              <label className={labelStyle}>ইমেজ কোয়ালিটি</label>
              <select
                  value={imageQuality}
                  onChange={(e) => setImageQuality(e.target.value)}
                  className={inputStyle}
              >
                <option value="Low">Low (Fast, Small Size - 1x)</option>
                <option value="Medium">Medium (Balanced - 1.5x)</option>
                <option value="High">High (Crisp, Large Size - 2x)</option>
              </select>
            </div>

            {/* --- নতুন: আউটপুট ফরম্যাট সিলেক্ট মেনু --- */}
            <div>
              <label className={labelStyle}>আউটপুট ফরম্যাট</label>
              <select
                  value={imageFormat}
                  onChange={(e) => setImageFormat(e.target.value)}
                  className={inputStyle}
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPG</option>
                <option value="webp">WEBP</option>
              </select>
            </div>

            {/* কালার ইনপুট (আপডেট করা হয়েছে) */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelStyle}>শেপ কালার</label>
                <input type="color" value={shapeColor} onChange={(e) => setShapeColor(e.target.value)} className="w-full h-10 p-1 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className={labelStyle}>সাইড টেক্সট</label>
                <input type="color" value={sideTextColor} onChange={(e) => setSideTextColor(e.target.value)} className="w-full h-10 p-1 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className={labelStyle}>টেক্সট কালার ১</label>
                <input type="color" value={textColor1} onChange={(e) => setTextColor1(e.target.value)} className="w-full h-10 p-1 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className={labelStyle}>টেক্সট কালার ২</label>
                <input type="color" value={textColor2} onChange={(e) => setTextColor2(e.target.value)} className="w-full h-10 p-1 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className={labelStyle}>টেক্সট কালার ৩</label>
                <input type="color" value={textColor3} onChange={(e) => setTextColor3(e.target.value)} className="w-full h-10 p-1 border border-gray-300 rounded-md" />
              </div>
            </div>

            {/* ব্যাকগ্রাউন্ড কালার পিকার */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelStyle}>ব্যাকগ্রাউন্ড</label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 p-1 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className={labelStyle}>ওয়েভ ১ (উপরে)</label>
                <input type="color" value={waveColor1} onChange={(e) => setWaveColor1(e.target.value)} className="w-full h-10 p-1 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className={labelStyle}>ওয়েভ ২ (নিচে)</label>
                <input type="color" value={waveColor2} onChange={(e) => setWaveColor2(e.target.value)} className="w-full h-10 p-1 border border-gray-300 rounded-md" />
              </div>
            </div>

            {/* ইমেজ ইনপুট */}
            <div>
              <label className={labelStyle}>লোগো পরিবর্তন করুন (উপরের)</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLogo)} className={fileInputStyle} />
            </div>
            <div>
              <label className={labelStyle}>ফুল পরিবর্তন করুন (কোণার)</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setFlowerImage)} className={fileInputStyle} />
            </div>

            {/* --- ফুটার লোগো কন্ট্রোল (নতুন) --- */}
            <div className="p-3 border border-gray-200 rounded-lg space-y-3">
              <h4 className="font-medium text-gray-700">ফুটার লোগো স্টাইল</h4>

              {/* চেকবক্স */}
              <div className="flex items-center">
                <input
                    id="showFooterLogoBg"
                    type="checkbox"
                    checked={showFooterLogoBg}
                    onChange={(e) => setShowFooterLogoBg(e.target.checked)}
                    className={checkboxInputStyle}
                />
                <label htmlFor="showFooterLogoBg" className={checkboxLabelStyle}>
                  ব্যাকগ্রাউন্ড দেখান
                </label>
              </div>

              {/* কালার পিকার (conditional) */}
              {showFooterLogoBg && (
                  <div>
                    <label className={labelStyle}>ফুটার লোগো ব্যাকগ্রাউন্ড কালার</label>
                    <input
                        type="color"
                        value={footerLogoBgColor}
                        onChange={(e) => setFooterLogoBgColor(e.target.value)}
                        className="w-full h-10 p-1 border border-gray-300 rounded-md"
                    />
                  </div>
              )}

              {/* রাউন্ডেড স্লাইডার (conditional) */}
              {showFooterLogoBg && (
                  <div>
                    <label className={`${labelStyle} flex justify-between`}>
                      <span>ফুটার লোগো রাউন্ডেড</span>
                      <span className="font-bold text-gray-600">{footerLogoBorderRadius}px</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={footerLogoBorderRadius}
                        onChange={(e) => setFooterLogoBorderRadius(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
                    />
                  </div>
              )}
            </div>

            <div>
              <label className={labelStyle}>ফুটার লোগো পরিবর্তন করুন (নিচের)</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setFooterLogo)} className={fileInputStyle} />
            </div>
          </div>

          <button
              onClick={onDownload}
              // স্ক্রিপ্ট লোড না হলে বাটনটি নিষ্ক্রিয় করুন
              disabled={!isScriptLoaded}
              className={`mt-8 w-full font-bold py-3 px-4 rounded-lg transition duration-300 ${
                  isScriptLoaded
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
          >
            {/* স্ক্রিপ্ট লোড হওয়ার অবস্থা অনুযায়ী টেক্সট পরিবর্তন করুন */}
            {isScriptLoaded ? 'Download Thumbnail' : 'Loading Script...'}
          </button>
        </div>

        {/* === (এই সেকশনটি পরিবর্তন করা হয়েছে) === */}
        {/* ডান দিকে থাম্বনেইল প্রিভিউ (রেসপন্সিভ) */}
        <div className="w-full lg:w-auto">
          {/* এই div টি প্রিভিউর উচ্চতা কন্ট্রোল করে। */}
          <div className="h-[213px] sm:h-[340px] md:h-[510px] lg:h-[680px] overflow-hidden">
            {/* এই div টি 1200x680 সাইজেরই থাকে, কিন্তু transform-origin-top-left
            এবং scale-* ক্লাসগুলো দিয়ে একে ছোট করে দেখানো হয়।
          */}
            <div
                ref={thumbnailRef}
                className="relative w-[1200px] h-[680px] overflow-hidden shadow-2xl
                       transform-origin-top-left scale-[0.3125] sm:scale-50 md:scale-75 lg:scale-100"
                style={{ backgroundColor: bgColor }}
            >
              {/* === ওয়েভ ডিজাইন === */}
              <div
                  className="absolute w-[106%] h-[995px] top-[-679px] left-[-3%] rounded-full z-10"
                  style={{ backgroundColor: waveColor1 }}
              />
              <div
                  className="absolute w-[125%] h-[1197px] top-[-880px] left-[-12%] rounded-full z-0"
                  style={{ backgroundColor: waveColor2 }}
              />

              {/* === সাইড টেক্সট === */}
              <p
                  className="absolute top-1/2 -translate-y-1/2 -rotate-90 font-semibold text-xl tracking-widest z-20"
                  style={{
                    color: sideTextColor,
                    left: `${sideTextX}px`,
                    fontFamily: fontFamily
                  }}
              >
                {sideText}
              </p>

              {/* === কন্টেন্ট ব্লক (আপডেট করা হয়েছে) === */}
              <div
                  className="absolute inset-0 flex flex-col items-center justify-end space-y-2 text-center z-20"
                  style={{ transform: `translateY(${contentY}px)` }}
              >
                <div style={{ marginBottom: `${logoMarginBottom}px` }}>
                  <img
                      src={logo}
                      alt="Logo"
                      style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
                      className="object-contain"
                      crossOrigin="anonymous"
                  />
                </div>

                {/* === টেক্সট লেয়ার ১ === */}
                <div
                    className="py-2 px-4 rounded-lg shadow-md"
                    style={{
                      backgroundColor: shapeColor,
                      color: textColor1,
                      fontFamily: fontFamily,
                      borderRadius: `${line1BorderRadius}px` // --- নতুন যোগ করা হয়েছে ---
                    }}
                >
                  <h1 className="text-4xl font-bold">{line1}</h1>
                </div>

                {/* === টেক্সট লেয়ার ২ === */}
                <div
                    className={showLine2Bg ? "py-2 px-4 rounded-lg shadow-md" : "py-2 px-4"}
                    style={{
                      backgroundColor: showLine2Bg ? shapeColor : 'transparent',
                      color: textColor2,
                      fontFamily: fontFamily
                    }}
                >
                  <h2 className="text-5xl font-extrabold">{line2}</h2>
                </div>

                {/* === টেক্সট লেয়ার ৩ === */}
                <div
                    className={showLine3Bg ? "py-2 px-4 rounded-lg shadow-md" : "py-2 px-4"}
                    style={{
                      backgroundColor: showLine3Bg ? shapeColor : 'transparent',
                      color: textColor3,
                      fontFamily: fontFamily
                    }}
                >
                  <h3 className="text-4xl font-bold">{line3}</h3>
                </div>

                <img
                    src={footerLogo}
                    alt="Footer Logo"
                    className="mt-4 object-contain"
                    crossOrigin="anonymous"
                    // --- নতুন স্টাইল যোগ করা হয়েছে ---
                    style={{
                      width: '200px',
                      height: '50px',
                      objectFit: 'contain',
                      backgroundColor: showFooterLogoBg ? footerLogoBgColor : 'transparent',
                      borderRadius: `${footerLogoBorderRadius}px`,
                      padding: showFooterLogoBg ? '2px' : '0px', // <-- 1px থেকে 8px করা হয়েছে
                      boxSizing: 'border-box' // প্যাডিং যেন সাইজ পরিবর্তন না করে
                    }}
                    // --- /নতুন স্টাইল ---
                />
              </div>

              {/* === নিচের ফুল === */}
              <img
                  src={flowerImage}
                  alt="Flower"
                  width="100"
                  height="100"
                  className="absolute bottom-8 left-8 z-20"
                  crossOrigin="anonymous"
              />
              <img
                  src={flowerImage}
                  alt="Flower"
                  width="100"
                  height="100"
                  className="absolute bottom-8 right-8 z-20"
                  crossOrigin="anonymous"
              />
            </div>
          </div>
        </div>
      </main>
  );
}