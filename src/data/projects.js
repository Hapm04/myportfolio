import hotelThumb from "../assets/hotel-restaurant.jpg";
import attendanceThumb from "../assets/attendance-auto.jpg";
import envThumb from "../assets/environment-monitoring.jpg";

export const PROJECTS = [
  {
    title: "Hotel-Restaurant",
    period: "24/02 - 19/04",
    role: { vi: "Full-stack", en: "Full-stack" },
    status: { vi: "Hoàn thành", en: "Done" },
    image: hotelThumb,
    desc: {
      vi: "Web app theo kiến trúc client–server cho bài toán nhà hàng/khách sạn nhiều chi nhánh: đặt phòng, đặt món theo chi nhánh, quản lý thông tin khách hàng.",
      en: "Client–server web app for multi-branch hotel/restaurant: room booking, branch-based ordering, and customer info management.",
    },
    highlights: {
      vi: ["Client–server tách biệt", "Luồng đặt phòng + đặt món theo chi nhánh", "Dễ mở rộng & tích hợp API"],
      en: ["Separated client–server", "Booking + branch-based ordering flow", "Easy to extend & integrate APIs"],
    },
    stack: ["JavaScript", "Client/Server"],
    github: "https://github.com/Hapm04/hotel-restaurant",
    demo: "",
  },
  {
    title: "Attendance-Auto",
    period: "28/10 - 02/12",
    role: { vi: "Design", en: "Design" },
    status: { vi: "Hoàn thành", en: "Done" },
    image: attendanceThumb,
    desc: {
      vi: "Ứng dụng điểm danh theo danh sách có sẵn; check-in bằng QR và kiểm tra phạm vi vị trí hợp lệ, đồng bộ trạng thái điểm danh.",
      en: "Attendance app for predefined student lists; QR check-in with location-range validation and synced attendance status.",
    },
    highlights: {
      vi: ["QR check-in", "Kiểm tra vị trí trong phạm vi", "Lưu & đồng bộ trạng thái"],
      en: ["QR check-in", "Allowed-range location validation", "Store & sync status"],
    },
    stack: ["C#", "T-SQL"],
    github: "https://github.com/Hapm04/CNPMDD",
    demo: "",
  },
  {
    title: "Environment-Monitoring",
    period: "10/11 - 28/12",
    role: { vi: "Design", en: "Design" },
    status: { vi: "Hoàn thành", en: "Done" },
    image: envThumb,
    desc: {
      vi: "Ứng dụng tổng hợp dữ liệu môi trường (đất/nước/không khí), đưa lên lớp phân tích và trả kết quả; định hướng phân tích chuyên sâu (BI).",
      en: "Environmental monitoring app aggregating land/water/air data, feeding an analysis layer to produce insights; BI-oriented.",
    },
    highlights: {
      vi: ["Tổng hợp nhiều nguồn dữ liệu", "Lớp phân tích/BI", "Trả kết quả theo chỉ số"],
      en: ["Multi-source aggregation", "Analysis/BI layer", "KPI-based outputs"],
    },
    stack: ["C#", "T-SQL"],
    github: "https://github.com/Hapm04/CNPM",
    demo: "",
  },
];
