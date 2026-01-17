"use client";

function ResultExam() {
  //   const componentRef = useRef();

  // Hàm xử lý in PDF
  //   const handlePrint = useReactToPrint({
  //     content: () => componentRef.current,
  //     documentTitle: 'Phieu_Ket_Qua_Sat_Hach',
  //   });

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      {/* Nút bấm điều khiển - Không in vào PDF */}
      <button
        // onClick={handlePrint}
        className="mb-5 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
      >
        Xuất file PDF / In Phiếu
      </button>

      {/* Vùng nội dung in */}
      <div
        // ref={componentRef}
        className="bg-white w-[210mm] min-h-[297mm] p-[15mm] shadow-lg text-black font-serif leading-relaxed"
        style={{ fontFamily: '"Times New Roman", Times, serif' }}
      >
        {/* Header Section [cite: 1] */}
        <div className="flex justify-between items-start text-center mb-8">
          <div className="w-[45%]">
            <h2 className="font-bold text-[13pt] uppercase">Bộ Nông nghiệp và Môi trường [cite: 1]</h2>
            <h2 className="font-bold text-[13pt] uppercase leading-tight">
              Công ty TNHH MTV KTCTTL Bắc Nam Hà [cite: 1]
            </h2>
            <div className="mt-1 border-t border-black w-24 mx-auto"></div>
          </div>
          <div className="w-[50%]">
            <h2 className="font-bold text-[13pt] uppercase">Cộng hòa Xã hội Chủ nghĩa Việt Nam [cite: 1]</h2>
            <h2 className="font-bold text-[13pt]">Độc lập – Tự do – Hạnh phúc [cite: 1]</h2>
            <div className="mt-1 border-t border-black w-32 mx-auto"></div>
          </div>
        </div>

        {/* Title Section [cite: 2, 3] */}
        <div className="text-center mb-10">
          <h1 className="font-bold text-[16pt] uppercase mb-2">
            Phiếu kết quả kiểm tra quy trình năm............. [cite: 2]
          </h1>
          <p className="italic text-[13pt]">
            BÀI KIỂM TRA:
            .................................................................................................. [cite: 3]
          </p>
        </div>

        {/* Info Section  */}
        <div className="space-y-4 text-[13pt]">
          <div className="flex justify-between">
            <div className="w-[48%] flex items-end">
              <span>Tài khoản:</span>
              <div className="flex-1 border-b border-dotted border-black ml-2 mb-1"></div>
            </div>
            <div className="w-[48%] flex items-end">
              <span>CMND/CCCD:</span>
              <div className="flex-1 border-b border-dotted border-black ml-2 mb-1"></div>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="w-[48%] flex items-end">
              <span>Họ và tên:</span>
              <div className="flex-1 border-b border-dotted border-black ml-2 mb-1"></div>
            </div>
            <div className="w-[48%] flex items-end">
              <span>Ngày sinh:</span>
              <div className="flex-1 border-b border-dotted border-black ml-2 mb-1"></div>
            </div>
          </div>

          <div className="flex items-end">
            <span>Địa chỉ thường trú:</span>
            <div className="flex-1 border-b border-dotted border-black ml-2 mb-1"></div>
          </div>

          <div className="flex items-end">
            <span>Đơn vị:</span>
            <div className="flex-1 border-b border-dotted border-black ml-2 mb-1"></div>
          </div>

          <div className="flex items-end">
            <span>Ngày thi:</span>
            <span className="ml-2">........../........../............</span>
          </div>
        </div>

        {/* Result Section  */}
        <div className="mt-10 font-bold text-[13pt] space-y-3">
          <p>Điểm thi: (…......../…….…. ) </p>
          <p>Kết quả: (Đạt/Không đạt) </p>
        </div>

        {/* Signature Section  */}
        <div className="mt-16 grid grid-cols-2 text-center gap-10">
          <div>
            <p className="font-bold uppercase mb-1">Cán bộ coi </p>
            <p className="italic text-sm">(Ký, ghi rõ họ tên) </p>
            <div className="h-24"></div>
          </div>
          <div>
            <p className="font-bold uppercase mb-1">Thí sinh </p>
            <p className="italic text-sm">(Ký, ghi rõ họ tên) </p>
            <div className="h-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultExam;
