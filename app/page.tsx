'use client'; 

import { useState, useRef, useCallback, ChangeEvent } from 'react';
// Next.js এর <Image> কম্পোনেন্ট এখানে আর import করার দরকার নেই
import { toPng } from 'html-to-image';

export default function Home() {
  // === স্টেট ভ্যারিয়েবল ===
  const [logo, setLogo] = useState<string>('/logo.png');
  const [line1, setLine1] = useState<string>('বাংলাদেশ উন্মুক্ত বিশ্ববিদ্যালয়ে');
  const [line2, setLine2] = useState<string>('নিয়োগ বিজ্ঞপ্তি');
  const [line3, setLine3] = useState<string>('পরীক্ষার তারিখ ও ফলাফল');
  const [sideText, setSideText] = useState<string>('www.ebdresults.com');
  const [shapeColor, setShapeColor] = useState<string>('#B91C1C'); 
  const [textColor, setTextColor] = useState<string>('#FFFFFF'); 
  const [sideTextColor, setSideTextColor] = useState<string>('#FFFFFF'); 
  const [flowerImage, setFlowerImage] = useState<string>('/flower.png');
  const [footerLogo, setFooterLogo] = useState<string>('/footer-logo.png');
  const [contentY, setContentY] = useState<number>(0);
  const [bgColor, setBgColor] = useState<string>('#3a55df'); 
  const [waveColor1, setWaveColor1] = useState<string>('#d6dbdf'); 
  const [waveColor2, setWaveColor2] = useState<string>('#abb2b9'); 
  const [logoSize, setLogoSize] = useState<number>(100); 
  const [logoMarginBottom, setLogoMarginBottom] = useState<number>(16); 
  const [sideTextX, setSideTextX] = useState<number>(0);
  const [imageQuality, setImageQuality] = useState<string>('Medium');
  const [fontFamily, setFontFamily] = useState<string>('var(--font-hind-siliguri)');

  const thumbnailRef = useRef<HTMLDivElement>(null);

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

  // === (এই ফাংশনটি ডাউনলোড করে - কোয়ালিটি অপশন সহ) ===
  const onDownload = useCallback(() => {
    if (thumbnailRef.current === null) {
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
      quality: 1.0,
      pixelRatio: pixelRatioValue
    };

    toPng(thumbnailRef.current, options)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'dynamic-thumbnail.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('oops, something went wrong!', err);
        alert('দুঃখিত, ডাউনলোড করা সম্ভব হয়নি। অনুগ্রহ করে কনসোল চেক করুন।');
      });
  }, [thumbnailRef, imageQuality]); 

  // ইনপুট স্টাইল
  const inputStyle = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900";
  const labelStyle = "block text-sm font-medium text-gray-700";
  const fileInputStyle = "mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100";

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
          </div>
          <div>
            <label className={labelStyle}>দ্বিতীয় লাইন</label>
            <input type="text" value={line2} onChange={(e) => setLine2(e.target.value)} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>তৃতীয় লাইন</label>
            <input type="text" value={line3} onChange={(e) => setLine3(e.target.value)} className={inputStyle} />
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
          
          {/* কোয়ালিটি সিলেক্ট মেনু */}
          <div>
            <label className={labelStyle}>ইমেজ কোয়ালিটি</label>
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

          {/* কালার ইনপুট */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelStyle}>শেপ কালার</label>
              <input type="color" value={shapeColor} onChange={(e) => setShapeColor(e.target.value)} className="w-full h-10 p-1 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className={labelStyle}>টেক্সট কালার</label>
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-10 p-1 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className={labelStyle}>সাইড টেক্সট</label>
              <input type="color" value={sideTextColor} onChange={(e) => setSideTextColor(e.target.value)} className="w-full h-10 p-1 border border-gray-300 rounded-md" />
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
          <div>
            <label className={labelStyle}>ফুটার লোগো পরিবর্তন করুন (নিচের)</label>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setFooterLogo)} className={fileInputStyle} />
          </div>
        </div>

        <button
          onClick={onDownload}
          className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
        >
          Download Thumbnail
        </button>
      </div>

      {/* === (এই সেকশনটি পরিবর্তন করা হয়েছে) === */}
      {/* ডান দিকে থাম্বনেইল প্রিভিউ (রেসপন্সিভ) */}
      <div className="w-full lg:w-auto">
        {/* এই div টি প্রিভিউর উচ্চতা কন্ট্রোল করে।
          মোবাইলে (scale-[0.3125]) উচ্চতা: 630px * 0.3125 = 197px
          sm (scale-50): 630px * 0.5 = 315px
          md (scale-75): 630px * 0.75 = 473px
          lg (scale-100): 630px * 1 = 630px
        */}
        <div className="h-[197px] sm:h-[315px] md:h-[473px] lg:h-[630px] overflow-hidden">
          {/* এই div টি 1200x630 সাইজেরই থাকে, কিন্তু transform-origin-top-left 
            এবং scale-* ক্লাসগুলো দিয়ে একে ছোট করে দেখানো হয়।
          */}
          <div
            ref={thumbnailRef}
            className="relative w-[1200px] h-[630px] overflow-hidden shadow-2xl 
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

            {/* === কন্টেন্ট ব্লক === */}
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

              <div 
                className="py-2 px-4 rounded-lg shadow-md"
                style={{ 
                  backgroundColor: shapeColor, 
                  color: textColor, 
                  fontFamily: fontFamily
                }}
              >
                <h1 className="text-4xl font-bold">{line1}</h1>
              </div>
              <div 
                className="py-2 px-4 rounded-lg shadow-md"
                style={{ 
                  backgroundColor: shapeColor, 
                  color: textColor,
                  fontFamily: fontFamily
                }}
              >
                <h2 className="text-5xl font-extrabold">{line2}</h2>
              </div>
              <div 
                className="py-2 px-4 rounded-lg shadow-md"
                style={{ 
                  backgroundColor: shapeColor, 
                  color: textColor,
                  fontFamily: fontFamily
                }} 
              >
                <h3 className="text-4xl font-bold">{line3}</h3>
              </div>
              <img 
                src={footerLogo} 
                alt="Footer Logo" 
                width="200" 
                height="50" 
                className="mt-4" 
                crossOrigin="anonymous"
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