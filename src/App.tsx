import React from 'react';
import { Phone, Search, Menu, X, Facebook, Instagram, Youtube, MapPin, Mail, Clock, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// --- Constants ---

const PRODUCTS = [
  { id: '1', title: 'Sàn Gỗ Sồi Nga Heritage', price: 1250000, priceStr: '1.250.000₫', cat: 'Sàn Gỗ Tự Nhiên', color: '#d2b48c', tag: 'Bán Chạy', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80' },
  { id: '2', title: 'Sàn SPC Walnut Dark Stone', price: 450000, priceStr: '450.000₫', cat: 'Sàn Nhựa SPC', color: '#5d4037', img: 'https://images.unsplash.com/photo-1581850518616-bcb8186c443e?auto=format&fit=crop&q=80' },
  { id: '3', title: 'Vinyl Nordic Pine White', price: 320000, priceStr: '320.000₫', cat: 'Sàn Nhựa Vinyl', color: '#f3e5ab', tag: 'Mới', img: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80' },
  { id: '4', title: 'Sàn Gỗ Gõ Đỏ Lào Premium', price: 2800000, priceStr: '2.800.000₫', cat: 'Sàn Gỗ Tự Nhiên', color: '#8b4513', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80' },
  { id: '5', title: 'Sàn SPC Urban Concrete', price: 580000, priceStr: '580.000₫', cat: 'Sàn Nhựa SPC', color: '#d2b48c', img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80' },
  { id: '6', title: 'Sàn Gỗ Teak Golden Honey', price: 1950000, priceStr: '1.950.000₫', cat: 'Sàn Gỗ Tự Nhiên', color: '#f3e5ab', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80' },
  { id: '7', title: 'Tấm Ốp Nano Vân Gỗ Sáng', price: 150000, priceStr: '150.000₫', cat: 'Tấm Ốp Tường Nano', color: '#f3e5ab', img: 'https://images.unsplash.com/photo-1615873968403-89e068629275?auto=format&fit=crop&q=80' },
  { id: '8', title: 'PVC Vân Đá Marble Trắng', price: 250000, priceStr: '250.000₫', cat: 'PVC Vân Đá', color: '#f3e5ab', img: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80' },
  { id: '9', title: 'Giấy Dán Tường Luxury Gold', price: 85000, priceStr: '85.000₫', cat: 'Giấy Dán Tường', color: '#f3e5ab', tag: 'Mới Về', img: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80' },
  { id: '10', title: 'Thảm Cỏ Nhân Tạo 3cm', price: 95000, priceStr: '95.000₫', cat: 'Thảm Cỏ Nhân Tạo', color: '#5d4037', img: 'https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&q=80' },
];

// --- Types ---

type Page = 'home' | 'list' | 'detail' | 'projects' | 'project-detail' | 'search';

interface SiteSettings {
  hotline: string;
  email: string;
  address: string;
  footerText: string;
}

const PROJECTS_DATA = [
  {
    id: '1',
    title: 'Biệt Thự Vinhomes Riverside',
    location: 'Long Biên, Hà Nội',
    category: 'Sàn Gỗ Tự Nhiên',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
    desc: 'Thi công trọn gói sàn gỗ Gõ Đỏ Lào cho toàn bộ không gian 3 tầng biệt thự.',
    fullDesc: 'Dự án biệt thự tại Vinhomes Riverside yêu cầu sự sang trọng và đẳng cấp tuyệt đối. Chúng tôi đã tư vấn và thi công trọn gói sàn gỗ Gõ Đỏ Lào - loại gỗ quý hiếm với vân gỗ đẹp và độ bền vĩnh cửu. Toàn bộ diện tích 450m2 sàn được xử lý tỉ mỉ, kết hợp với phào chỉ đồng bộ tạo nên không gian sống thượng lưu.',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80'
    ]
  },
  {
    id: '2',
    title: 'Penthouse Sunshine City',
    location: 'Tây Hồ, Hà Nội',
    category: 'Tấm Ốp Tường & Rèm',
    img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80',
    desc: 'Sử dụng tấm ốp Nano vân đá kết hợp rèm cửa voan cao cấp tạo không gian hiện đại.',
    fullDesc: 'Với tầm nhìn panorama hướng ra cầu Nhật Tân, căn Penthouse tại Sunshine City được thiết kế theo phong cách hiện đại, tối giản. Điểm nhấn là hệ thống tấm ốp tường Nano vân đá cẩm thạch kết hợp với rèm cửa voan 2 lớp, vừa đảm bảo tính thẩm mỹ vừa tối ưu ánh sáng tự nhiên.',
    gallery: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80'
    ]
  },
  {
    id: '3',
    title: 'Nhà Hàng Sen Tây Hồ',
    location: 'Tây Hồ, Hà Nội',
    category: 'Sàn Nhựa SPC',
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    desc: 'Lắp đặt sàn nhựa SPC chịu lực cao cho khu vực sảnh chính và phòng VIP.',
    fullDesc: 'Dự án cải tạo sàn nhà hàng Sen Tây Hồ đòi hỏi vật liệu có khả năng chịu nước 100% và chống trầy xước cực tốt do mật độ đi lại cao. Sàn nhựa SPC vân gỗ sồi đã được lựa chọn để mang lại vẻ ấm cúng nhưng vẫn đảm bảo độ bền công nghiệp.',
    gallery: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?auto=format&fit=crop&q=80'
    ]
  },
  {
    id: '4',
    title: 'Căn Hộ Goldmark City',
    location: 'Bắc Từ Liêm, Hà Nội',
    category: 'Giấy Dán Tường & Phào Chỉ',
    img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80',
    desc: 'Trang trí phòng ngủ với giấy dán tường Hàn Quốc và phào chỉ tân cổ điển.',
    fullDesc: 'Căn hộ tại Goldmark City được trang trí theo phong cách Tân cổ điển nhẹ nhàng. Chúng tôi sử dụng giấy dán tường Hàn Quốc họa tiết chìm kết hợp với hệ thống phào chỉ PU trắng sứ, tạo nên không gian nghỉ ngơi thư giãn và sang trọng.',
    gallery: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80'
    ]
  },
  {
    id: '5',
    title: 'Văn Phòng Techcombank',
    location: 'Hoàn Kiếm, Hà Nội',
    category: 'Thảm Cỏ & Sàn Gỗ',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
    desc: 'Kiến tạo không gian xanh với thảm cỏ nhân tạo và sàn gỗ công nghiệp cao cấp.',
    fullDesc: 'Thiết kế văn phòng mở hiện đại cho Techcombank, kết hợp giữa sàn gỗ công nghiệp màu xám trung tính và các mảng xanh từ thảm cỏ nhân tạo tại khu vực pantry và relax zone, giúp nhân viên có không gian làm việc sáng tạo.',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?auto=format&fit=crop&q=80'
    ]
  },
  {
    id: '6',
    title: 'Showroom Mercedes-Benz',
    location: 'Hải Phòng',
    category: 'Sàn Nhựa Vinyl',
    img: 'https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?auto=format&fit=crop&q=80',
    desc: 'Sàn nhựa Vinyl chống trượt, chịu tải trọng lớn cho khu vực trưng bày xe.',
    fullDesc: 'Showroom ô tô yêu cầu sàn nhà có độ bóng cao nhưng phải chống trượt và chịu được tải trọng lớn của xe trưng bày. Sàn nhựa Vinyl cuộn cao cấp đã đáp ứng hoàn hảo các tiêu chuẩn kỹ thuật khắt khe này.',
    gallery: [
      'https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80'
    ]
  }
];

// --- Components ---

const Navbar = ({ onNavigate, currentPage, onSearchClick }: { onNavigate: (p: Page) => void, currentPage: Page, onSearchClick: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = React.useState(false);

  const categories = [
    {
      title: 'Sàn Gỗ Cao Cấp',
      items: ['Sàn Gỗ Tự Nhiên', 'Sàn Gỗ Công Nghiệp', 'Sàn Nhựa SPC', 'Sàn Nhựa Vinyl']
    },
    {
      title: 'Trang Trí Tường',
      items: ['Tấm Ốp Nano', 'PVC Vân Đá', 'Xốp Dán Tường 3D', 'Giấy Dán Tường']
    },
    {
      title: 'Vật Liệu Khác',
      items: ['Thảm Cỏ Nhân Tạo', 'Phào Chỉ Trang Trí', 'Rèm Cửa Sang Trọng', 'Phụ Kiện Thi Công']
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-luxe-champagne/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
          <img 
            src="https://storage.googleapis.com/static.antigravity.dev/projects/fpgvvfozh5rlgizskkepiy/logo.png" 
            alt="Hoangan Decor" 
            className="h-12 w-auto"
          />
        </div>

        <ul className="hidden md:flex items-center space-x-10 text-[13px] uppercase tracking-[0.2em] font-medium text-luxe-text h-full">
          <li 
            className="h-full flex items-center relative group"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
          >
            <button 
              onClick={() => onNavigate('list')}
              className={cn(
                "relative transition-colors duration-300 hover:text-luxe-gold flex items-center gap-1",
                currentPage === 'list' && "text-luxe-gold"
              )}
            >
              Sản Phẩm
              <span className="material-symbols-outlined text-[14px] transition-transform group-hover:rotate-180">expand_more</span>
            </button>

            {/* Mega Menu */}
            <div className={cn(
              "absolute top-full left-1/2 -translate-x-1/2 w-[800px] bg-white shadow-2xl border border-luxe-champagne/10 p-10 transition-all duration-500 origin-top",
              isMegaMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-4"
            )}>
              <div className="grid grid-cols-3 gap-12">
                {categories.map((cat, idx) => (
                  <div key={idx}>
                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-luxe-gold font-bold mb-6 border-b border-luxe-champagne/10 pb-2">{cat.title}</h4>
                    <ul className="space-y-4">
                      {cat.items.map((item, i) => (
                        <li key={i}>
                          <button 
                            onClick={() => { onNavigate('list'); setIsMegaMenuOpen(false); }}
                            className="text-luxe-text hover:text-luxe-gold transition-colors normal-case tracking-normal text-sm opacity-70 hover:opacity-100"
                          >
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t border-luxe-champagne/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80" alt="Promo" className="w-16 h-16 object-cover" />
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-luxe-gold font-bold">Ưu đãi tháng 3</p>
                    <p className="text-xs text-luxe-black">Giảm 20% cho đơn hàng thi công trọn gói</p>
                  </div>
                </div>
                <button onClick={() => onNavigate('list')} className="text-[10px] uppercase tracking-widest bg-luxe-black text-white px-6 py-2 hover:bg-luxe-gold transition-colors">Xem tất cả</button>
              </div>
            </div>
          </li>
          <li>
            <button 
              onClick={() => onNavigate('projects')}
              className={cn(
                "relative transition-colors duration-300 hover:text-luxe-gold",
                currentPage === 'projects' && "text-luxe-gold"
              )}
            >
              Dự Án
            </button>
          </li>
        </ul>

        <div className="flex items-center space-x-6">
          <button 
            onClick={onSearchClick}
            className="text-luxe-text hover:text-luxe-gold transition-colors hidden md:block"
          >
            <Search size={20} />
          </button>
          
          <div className="hidden sm:flex items-center space-x-3 group cursor-pointer border-l border-luxe-champagne/20 pl-6 bg-luxe-gold/5 py-2 px-4 rounded-full border border-luxe-gold/20 hover:bg-luxe-gold/10 transition-all duration-300">
            <div className="w-10 h-10 rounded-full bg-luxe-gold text-white flex items-center justify-center shadow-lg shadow-luxe-gold/20 animate-pulse-subtle">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-luxe-gold font-bold leading-none mb-1">Hotline 24/7</p>
              <p className="font-serif text-lg text-luxe-black tracking-wider leading-none font-bold">0909 123 456</p>
            </div>
          </div>

          <button className="md:hidden text-luxe-black" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-luxe-ivory border-b border-luxe-champagne/10 p-6 flex flex-col space-y-4 text-[11px] uppercase tracking-widest font-medium">
          <button 
            onClick={() => { onSearchClick(); setIsMenuOpen(false); }}
            className="flex items-center gap-3 text-luxe-gold"
          >
            <Search size={16} /> Tìm kiếm
          </button>
          <button onClick={() => { onNavigate('list'); setIsMenuOpen(false); }}>Sản Phẩm</button>
          <button onClick={() => { onNavigate('projects'); setIsMenuOpen(false); }}>Dự Án</button>
        </div>
      )}
    </nav>
  );
};

const Footer = ({ onConsult }: { onConsult: () => void }) => (
  <footer className="bg-luxe-black text-luxe-ivory pt-24 pb-12">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div>
          <div className="mb-8">
            <img 
              src="https://storage.googleapis.com/static.antigravity.dev/projects/fpgvvfozh5rlgizskkepiy/logo.png" 
              alt="Hoangan Decor" 
              className="h-10 w-auto brightness-0 invert"
            />
          </div>
          <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-xs">
            Chuyên cung cấp vật liệu trang trí nội thất cao cấp — nơi phong cách và chất lượng giao thoa, kiến tạo không gian sống đẳng cấp.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-8 h-8 flex items-center justify-center border border-white/10 text-[10px] hover:border-luxe-champagne hover:text-luxe-champagne transition-all">FB</a>
            <a href="#" className="w-8 h-8 flex items-center justify-center border border-white/10 text-[10px] hover:border-luxe-champagne hover:text-luxe-champagne transition-all">IG</a>
            <a href="#" className="w-8 h-8 flex items-center justify-center border border-white/10 text-[10px] hover:border-luxe-champagne hover:text-luxe-champagne transition-all">YT</a>
          </div>
        </div>
        <div>
          <h5 className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxe-champagne mb-8">Sản Phẩm</h5>
          <ul className="space-y-4 text-white/50 text-xs font-light">
            <li><a href="#" className="hover:text-luxe-champagne transition-colors">Sàn Gỗ Tự Nhiên</a></li>
            <li><a href="#" className="hover:text-luxe-champagne transition-colors">Sàn Gỗ Công Nghiệp</a></li>
            <li><a href="#" className="hover:text-luxe-champagne transition-colors">Sàn Nhựa Giả Gỗ</a></li>
            <li><a href="#" className="hover:text-luxe-champagne transition-colors">Tấm Ốp Tường Nano/PVC</a></li>
            <li><a href="#" className="hover:text-luxe-champagne transition-colors">Xốp Dán Tường 3D</a></li>
            <li><a href="#" className="hover:text-luxe-champagne transition-colors">Giấy Dán Tường</a></li>
            <li><a href="#" className="hover:text-luxe-champagne transition-colors">Thảm Cỏ Nhân Tạo</a></li>
            <li><a href="#" className="hover:text-luxe-champagne transition-colors">Phào Chỉ Trang Trí</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxe-champagne mb-8">Dịch Vụ</h5>
          <ul className="space-y-4 text-white/50 text-xs font-light">
            <li><button onClick={onConsult} className="hover:text-luxe-champagne transition-colors">Tư Vấn Miễn Phí</button></li>
            <li><a href="#" className="hover:text-luxe-champagne transition-colors">Thiết Kế Phối Cảnh 3D</a></li>
            <li><a href="#" className="hover:text-luxe-champagne transition-colors">Thi Công Trọn Gói</a></li>
            <li><a href="#" className="hover:text-luxe-champagne transition-colors">Bảo Hành Chính Hãng</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxe-champagne mb-8">Liên Hệ</h5>
          <ul className="space-y-4 text-white/50 text-xs font-light">
            <li className="flex items-start space-x-3">
              <MapPin size={14} className="text-luxe-champagne mt-0.5" />
              <span>123 Đường Lê Lợi, Quận 1, TP.HCM</span>
            </li>
            <li className="flex items-start space-x-3">
              <Phone size={14} className="text-luxe-champagne mt-0.5" />
              <span>0909 123 456</span>
            </li>
            <li className="flex items-start space-x-3">
              <Mail size={14} className="text-luxe-champagne mt-0.5" />
              <span>contact@luxedecor.vn</span>
            </li>
            <li className="flex items-start space-x-3">
              <Clock size={14} className="text-luxe-champagne mt-0.5" />
              <span>8:00 – 20:00 mỗi ngày</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] uppercase tracking-widest text-white/30">© 2025 LuxeDecor. All Rights Reserved.</p>
        <div className="flex space-x-8 text-[10px] uppercase tracking-widest text-white/30">
          <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
          <a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a>
        </div>
      </div>
    </div>
  </footer>
);

// --- Pages ---

const HomePage = ({ onNavigate, onConsult, onSelectProject }: { onNavigate: (p: Page) => void, onConsult: () => void, onSelectProject: (id: string) => void }) => {
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);
  const [phone, setPhone] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSuccess(true);
      setPhone('');
      setIsSubmitting(false);
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1000);
  };
  const testimonials = [
    { name: 'Chị Minh Anh', role: 'Chủ biệt thự Vinhomes', text: 'Tôi rất hài lòng với sàn gỗ Sồi Mỹ của LuxeDecor. Màu sắc sang trọng, thi công rất tỉ mỉ và chuyên nghiệp.' },
    { name: 'Anh Hoàng Nam', role: 'Kiến trúc sư', text: 'LuxeDecor là đối tác tin cậy của tôi trong nhiều dự án. Vật liệu luôn đạt chuẩn và đa dạng mẫu mã.' },
    { name: 'Chị Thu Thảo', role: 'Chủ căn hộ Penthouse', text: 'Dịch vụ tư vấn rất tận tâm. Xốp dán tường 3D làm không gian phòng khách nhà tôi thay đổi hoàn toàn.' },
    { name: 'Anh Tuấn Kiệt', role: 'Chủ nhà hàng', text: 'Sàn nhựa SPC của Hoangan Decor thực sự bền bỉ. Dù lượng khách đi lại nhiều nhưng vẫn giữ được độ bóng và không trầy xước.' },
    { name: 'Chị Lan Hương', role: 'Thiết kế nội thất', text: 'Mẫu mã phào chỉ ở đây rất tinh tế, phù hợp với phong cách tân cổ điển mà tôi đang theo đuổi cho các dự án của mình.' }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  React.useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative min-h-screen pt-20 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col justify-center px-6 lg:px-24 py-20">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-[1px] w-12 bg-luxe-champagne"></div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-luxe-champagne font-medium">Vật Liệu Nội Thất Cao Cấp</span>
          </div>
          <h1 className="font-serif text-6xl lg:text-8xl leading-[1.1] mb-8 font-light">
            Kiến Tạo <br />
            <span className="text-luxe-champagne">Không Gian</span><br />
            Tinh Tế
          </h1>
          <p className="text-luxe-text text-base lg:text-lg leading-relaxed max-w-md mb-12 opacity-80">
            Bộ sưu tập vật liệu trang trí nội thất đẳng cấp — từ sàn gỗ sang trọng đến giấy dán tường nghệ thuật, tạo nên tổ ấm hoàn hảo theo phong cách riêng của bạn.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate('list')}
              className="bg-luxe-black text-white px-10 py-4 text-[11px] uppercase tracking-widest hover:bg-luxe-gold transition-colors duration-300"
            >
              Khám Phá Ngay
            </button>
            <button 
              onClick={onConsult}
              className="border border-luxe-champagne text-luxe-gold px-10 py-4 text-[11px] uppercase tracking-widest hover:bg-luxe-champagne hover:text-white transition-all duration-300"
            >
              Tư Vấn Miễn Phí
            </button>
          </div>
        </div>
        <div className="flex-1 relative min-h-[500px] lg:min-h-0 bg-luxe-mid">
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2 p-2">
            <div className="row-span-2 overflow-hidden group relative">
              <img 
                src="https://images.unsplash.com/photo-1581850518616-bcb8186c443e?auto=format&fit=crop&q=80" 
                alt="Sàn gỗ" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 left-6 text-white text-[10px] tracking-widest uppercase bg-black/30 backdrop-blur-sm px-3 py-1">Sàn Gỗ Cao Cấp</div>
            </div>
            <div className="overflow-hidden group relative">
              <img 
                src="https://images.unsplash.com/photo-1615873968403-89e068629275?auto=format&fit=crop&q=80" 
                alt="Ốp tường" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 left-6 text-white text-[10px] tracking-widest uppercase bg-black/30 backdrop-blur-sm px-3 py-1">Tấm Ốp Tường</div>
            </div>
            <div className="overflow-hidden group relative">
              <img 
                src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80" 
                alt="Thảm cỏ" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 left-6 text-white text-[10px] tracking-widest uppercase bg-black/30 backdrop-blur-sm px-3 py-1">Thảm Cỏ Nhân Tạo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-luxe-black py-16 text-luxe-ivory border-y border-luxe-champagne/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center md:border-r border-luxe-champagne/20">
            <div className="font-serif text-4xl text-luxe-champagne mb-1">500+</div>
            <div className="text-[11px] uppercase tracking-widest opacity-40">Mẫu Sản Phẩm</div>
          </div>
          <div className="text-center md:border-r border-luxe-champagne/20">
            <div className="font-serif text-4xl text-luxe-champagne mb-1">12+</div>
            <div className="text-[11px] uppercase tracking-widest opacity-40">Năm Kinh Nghiệm</div>
          </div>
          <div className="text-center md:border-r border-luxe-champagne/20">
            <div className="font-serif text-4xl text-luxe-champagne mb-1">8,000+</div>
            <div className="text-[11px] uppercase tracking-widest opacity-40">Khách Hàng</div>
          </div>
          <div className="text-center">
            <div className="font-serif text-4xl text-luxe-champagne mb-1">100%</div>
            <div className="text-[11px] uppercase tracking-widest opacity-40">Chất Lượng</div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-[1px] w-8 bg-luxe-champagne"></div>
                <span className="text-[10px] uppercase tracking-widest text-luxe-champagne font-semibold">Danh Mục Sản Phẩm</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-light">Bộ Sưu Tập <span className="text-luxe-gold">Đặc Trưng</span></h2>
            </div>
            <button 
              onClick={() => onNavigate('list')}
              className="text-[11px] uppercase tracking-widest text-luxe-gold border-b border-luxe-champagne/40 pb-1 hover:border-luxe-gold transition-all"
            >
              Xem tất cả bộ sưu tập →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group relative overflow-hidden h-[350px] cursor-pointer" onClick={() => onNavigate('list')}>
              <img src="https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80" alt="Sàn gỗ tự nhiên" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 cat-card-overlay flex flex-col justify-end p-8">
                <h3 className="font-serif text-2xl text-white mb-1">Sàn Gỗ Tự Nhiên</h3>
                <p className="text-white/60 text-[11px] tracking-wider uppercase mb-3">Sồi • Gõ Đỏ • Walnut</p>
                <span className="text-white text-[10px] transition-transform duration-300 group-hover:translate-x-2">→ Khám phá</span>
              </div>
            </div>
            <div className="group relative overflow-hidden h-[350px] cursor-pointer" onClick={() => onNavigate('list')}>
              <img src="https://images.unsplash.com/photo-1581850518616-bcb8186c443e?auto=format&fit=crop&q=80" alt="Sàn gỗ công nghiệp" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 cat-card-overlay flex flex-col justify-end p-8">
                <h3 className="font-serif text-2xl text-white mb-1">Sàn Công Nghiệp</h3>
                <p className="text-white/60 text-[11px] tracking-wider uppercase mb-3">Chống Nước • Bền Bỉ</p>
                <span className="text-white text-[10px] transition-transform duration-300 group-hover:translate-x-2">→ Khám phá</span>
              </div>
            </div>
            <div className="group relative overflow-hidden h-[350px] cursor-pointer" onClick={() => onNavigate('list')}>
              <img src="https://images.unsplash.com/photo-1615873968403-89e068629275?auto=format&fit=crop&q=80" alt="Tấm ốp tường" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 cat-card-overlay flex flex-col justify-end p-8">
                <h3 className="font-serif text-2xl text-white mb-1">Tấm Ốp Tường</h3>
                <p className="text-white/60 text-[11px] tracking-wider uppercase mb-3">Nano • PVC Vân Đá</p>
                <span className="text-white text-[10px] transition-transform duration-300 group-hover:translate-x-2">→ Khám phá</span>
              </div>
            </div>
            <div className="group relative overflow-hidden h-[350px] cursor-pointer" onClick={() => onNavigate('list')}>
              <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80" alt="Xốp dán tường" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 cat-card-overlay flex flex-col justify-end p-8">
                <h3 className="font-serif text-2xl text-white mb-1">Xốp Dán Tường</h3>
                <p className="text-white/60 text-[11px] tracking-wider uppercase mb-3">3D • Cách Âm</p>
                <span className="text-white text-[10px] transition-transform duration-300 group-hover:translate-x-2">→ Khám phá</span>
              </div>
            </div>
            <div className="group relative overflow-hidden h-[350px] cursor-pointer" onClick={() => onNavigate('list')}>
              <img src="https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80" alt="Giấy dán tường" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 cat-card-overlay flex flex-col justify-end p-8">
                <h3 className="font-serif text-2xl text-white mb-1">Giấy Dán Tường</h3>
                <p className="text-white/60 text-[11px] tracking-wider uppercase mb-3">Hàn Quốc • Nhật Bản</p>
                <span className="text-white text-[10px] transition-transform duration-300 group-hover:translate-x-2">→ Khám phá</span>
              </div>
            </div>
            <div className="group relative overflow-hidden h-[350px] cursor-pointer" onClick={() => onNavigate('list')}>
              <img src="https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&q=80" alt="Thảm cỏ" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 cat-card-overlay flex flex-col justify-end p-8">
                <h3 className="font-serif text-2xl text-white mb-1">Thảm Cỏ Nhân Tạo</h3>
                <p className="text-white/60 text-[11px] tracking-wider uppercase mb-3">Sân Vườn • Ban Công</p>
                <span className="text-white text-[10px] transition-transform duration-300 group-hover:translate-x-2">→ Khám phá</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Showcase */}
      <section className="flex flex-col lg:flex-row bg-luxe-cream">
        <div className="lg:w-1/2 h-[400px] lg:h-auto">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80" alt="Chất lượng" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="lg:w-1/2 px-6 lg:px-20 py-20 flex flex-col justify-center">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-[1px] w-8 bg-luxe-champagne"></div>
            <span className="text-[10px] uppercase tracking-widest text-luxe-champagne font-semibold">Giá Trị Cốt Lõi</span>
          </div>
          <h2 className="font-serif text-4xl lg:text-5xl font-light mb-10 leading-tight">Chất Lượng<br /><span className="text-luxe-gold">Vượt Mong Đợi</span></h2>
          <div className="space-y-8">
            {[
              { id: '01', title: 'Sản Phẩm Chính Hãng', desc: 'Nhập khẩu trực tiếp từ các thương hiệu hàng đầu, đầy đủ chứng nhận ISO & REACH quốc tế.' },
              { id: '02', title: 'Đa Dạng Mẫu Mã', desc: 'Hơn 500+ thiết kế đương đại, cập nhật xu hướng nội thất toàn cầu mỗi mùa.' },
              { id: '03', title: 'Thi Công & Bảo Hành', desc: 'Đội ngũ chuyên nghiệp, bảo hành chính hãng lên đến 5 năm trên toàn quốc.' }
            ].map(item => (
              <div key={item.id} className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-luxe-champagne/30 font-serif text-luxe-champagne text-xl">{item.id}</div>
                <div>
                  <h4 className="font-medium text-luxe-black mb-2 text-lg">{item.title}</h4>
                  <p className="text-luxe-text text-base leading-relaxed opacity-70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-luxe-gold font-medium mb-3 block">Sản Phẩm Nổi Bật</span>
            <h2 className="font-serif text-4xl lg:text-5xl font-light">Được Yêu Thích Nhất</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.slice(0, 6).map((item, idx) => (
              <div key={idx} className="group bg-luxe-ivory border border-luxe-mid hover:shadow-2xl hover:shadow-luxe-gold/10 transition-all duration-500 cursor-pointer" onClick={() => onNavigate('detail')}>
                <div className="overflow-hidden relative">
                  <img src={item.img} alt={item.title} className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  {item.tag && <span className="absolute top-4 left-4 bg-luxe-gold text-white text-[11px] uppercase tracking-widest px-3 py-1">{item.tag}</span>}
                </div>
                <div className="p-8">
                  <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-luxe-champagne mb-3">{item.cat}</p>
                  <h3 className="font-serif text-xl mb-3 group-hover:text-luxe-gold transition-colors">{item.title}</h3>
                  <p className="text-luxe-text text-sm leading-relaxed opacity-70 mb-6 line-clamp-2">Vật liệu cao cấp, bền bỉ theo thời gian. Mang lại vẻ đẹp sang trọng cho không gian sống của bạn.</p>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-luxe-gold text-lg">{item.priceStr}</span>
                    <button className="text-[10px] uppercase tracking-widest border border-luxe-champagne/30 px-5 py-2 hover:bg-luxe-gold hover:text-white transition-colors">Xem Chi Tiết</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-[1px] w-8 bg-luxe-champagne"></div>
                <span className="text-[10px] uppercase tracking-widest text-luxe-champagne font-semibold">Công Trình Thực Tế</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-light">Dự Án <span className="text-luxe-gold">Tiêu Biểu</span></h2>
            </div>
            <button 
              onClick={() => onNavigate('projects')}
              className="text-[11px] uppercase tracking-widest text-luxe-gold border-b border-luxe-champagne/40 pb-1 hover:border-luxe-gold transition-all"
            >
              Xem tất cả dự án →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS_DATA.slice(0, 3).map((project, idx) => (
              <div 
                key={idx} 
                className="group cursor-pointer"
                onClick={() => {
                  onSelectProject(project.id);
                  onNavigate('project-detail');
                }}
              >
                <div className="aspect-[16/10] overflow-hidden mb-6 relative">
                  <img src={project.img} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-luxe-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={12} className="text-luxe-gold" />
                    <span className="text-[9px] uppercase tracking-widest text-luxe-text/60 font-medium">{project.location}</span>
                  </div>
                  <h3 className="font-serif text-xl group-hover:text-luxe-gold transition-colors">{project.title}</h3>
                  <p className="text-luxe-text text-xs leading-relaxed opacity-60 line-clamp-2">{project.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-luxe-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] relative z-10">
                <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80" alt="Process" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-luxe-gold/10 -z-0 hidden lg:block"></div>
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-[1px] w-8 bg-luxe-champagne"></div>
                <span className="text-[10px] uppercase tracking-widest text-luxe-champagne font-semibold">Quy Trình Làm Việc</span>
              </div>
              <h2 className="font-serif text-4xl lg:text-5xl font-light mb-12">Kiến Tạo <span className="text-luxe-gold">Tận Tâm</span></h2>
              <div className="space-y-12">
                {[
                  { step: '01', title: 'Khảo Sát & Tư Vấn', desc: 'Đội ngũ kỹ thuật đến tận nơi đo đạc, tư vấn mẫu mã phù hợp với kiến trúc và phong thủy.' },
                  { step: '02', title: 'Thiết Kế Phối Cảnh', desc: 'Dựng phối cảnh 3D giúp khách hàng hình dung rõ nét không gian sau khi hoàn thiện.' },
                  { step: '03', title: 'Thi Công Chuyên Nghiệp', desc: 'Lắp đặt nhanh chóng, sạch sẽ bởi đội thợ lành nghề, đảm bảo tính thẩm mỹ cao nhất.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-8">
                    <span className="font-serif text-5xl text-luxe-champagne/20 font-bold leading-none">{item.step}</span>
                    <div>
                      <h4 className="font-medium text-lg mb-2">{item.title}</h4>
                      <p className="text-luxe-text text-base opacity-70 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl lg:text-5xl font-light">Khách Hàng Nói Gì?</h2>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="p-12 md:p-20 border border-luxe-champagne/10 bg-luxe-ivory relative text-center"
                >
                  <span className="text-8xl font-serif text-luxe-champagne/20 absolute top-10 left-1/2 -translate-x-1/2">“</span>
                  <p className="text-luxe-text text-xl md:text-2xl leading-relaxed mb-10 relative z-10 font-light italic">
                    {testimonials[currentTestimonial].text}
                  </p>
                  <div className="relative z-10">
                    <p className="font-bold text-lg text-luxe-black mb-1">{testimonials[currentTestimonial].name}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-luxe-gold font-medium">{testimonials[currentTestimonial].role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center items-center gap-8 mt-12">
              <button 
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full border border-luxe-champagne/20 flex items-center justify-center text-luxe-text hover:bg-luxe-gold hover:text-white hover:border-luxe-gold transition-all duration-300"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex gap-3">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      currentTestimonial === idx ? "bg-luxe-gold w-8" : "bg-luxe-champagne/30"
                    )}
                  />
                ))}
              </div>

              <button 
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full border border-luxe-champagne/20 flex items-center justify-center text-luxe-text hover:bg-luxe-gold hover:text-white hover:border-luxe-gold transition-all duration-300"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section id="contact-section" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-luxe-cream p-10 lg:p-20 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
            <div className="lg:w-3/5 relative z-10">
              <h2 className="font-serif text-4xl lg:text-5xl font-light mb-6">Bắt Đầu Hành Trình <br /><span className="text-luxe-gold">Trang Trí</span> Ngôi Nhà</h2>
              <p className="text-luxe-text text-base lg:text-lg opacity-70 mb-10 max-w-lg leading-relaxed">Nhận tư vấn miễn phí và báo giá chi tiết từ đội ngũ chuyên gia. Để lại thông tin liên hệ — chúng tôi sẽ gọi lại trong vòng 30 phút.</p>
              <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleConsultSubmit}>
                <input 
                  className="flex-grow border border-luxe-champagne/30 px-6 py-4 text-sm focus:ring-1 focus:ring-luxe-gold focus:border-luxe-gold outline-none bg-white/80 backdrop-blur-sm" 
                  placeholder="Số điện thoại của bạn..." 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <button 
                  disabled={isSubmitting}
                  className="bg-luxe-black text-white px-10 py-4 text-[11px] uppercase tracking-widest hover:bg-luxe-gold transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Nhận Tư Vấn'}
                </button>
              </form>
              {isSuccess && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-emerald-600 text-sm font-medium flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.
                </motion.p>
              )}
            </div>
            <div className="lg:w-2/5 flex justify-center relative">
              <div className="w-64 h-64 lg:w-80 lg:h-80 relative">
                <div className="absolute inset-0 border border-luxe-champagne/20 rounded-full -m-4 animate-[spin_20s_linear_infinite]"></div>
                <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80" alt="Decor" className="w-full h-full object-cover rounded-full shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductListPage = ({ onNavigate }: { onNavigate: (p: Page) => void }) => {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState('newest');

  const CATEGORIES = [
    'Sàn Gỗ Tự Nhiên', 
    'Sàn Gỗ Công Nghiệp', 
    'Sàn Nhựa SPC', 
    'Sàn Nhựa Vinyl',
    'Tấm Ốp Tường Nano', 
    'PVC Vân Đá', 
    'Xốp Dán Tường 3D',
    'Giấy Dán Tường',
    'Thảm Cỏ Nhân Tạo',
    'Phào Chỉ Trang Trí',
    'Rèm Cửa Cao Cấp'
  ];

  const COLORS = [
    { hex: '#f3e5ab', label: 'Vàng Sáng' },
    { hex: '#8b4513', label: 'Nâu Đậm' },
    { hex: '#d2b48c', label: 'Gỗ Tự Nhiên' },
    { hex: '#5d4037', label: 'Cà Phê' }
  ];

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedColor(null);
    setSortBy('newest');
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const catMatch = selectedCategories.length === 0 || selectedCategories.includes(p.cat);
    const colorMatch = !selectedColor || p.color === selectedColor;
    return catMatch && colorMatch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0; // 'newest' is default, no sorting for now as we don't have dates
  });

  return (
    <div className="pt-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Banner */}
      <section className="relative h-[400px] w-full overflow-hidden bg-luxe-mid">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581850518616-bcb8186c443e?auto=format&fit=crop&q=80')" }}>
          <div className="absolute inset-0 bg-luxe-black/40 flex items-center justify-center">
            <div className="text-center px-4">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="h-[1px] w-8 bg-white/60"></div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/80 font-medium">Danh Mục Sản Phẩm</span>
                <div className="h-[1px] w-8 bg-white/60"></div>
              </div>
              <h2 className="font-serif text-5xl md:text-7xl font-light text-white tracking-wide mb-6">Bộ Sưu Tập <span className="text-luxe-dark">Sàn Gỗ</span></h2>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-12">
              <div>
                <h3 className="font-serif text-2xl tracking-wider mb-6 flex items-center gap-3">
                  <Menu size={20} className="text-luxe-champagne" />
                  BỘ LỌC
                </h3>
                <div className="h-px bg-luxe-champagne/20 w-full mb-8"></div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxe-champagne">Danh mục</p>
                <div className="space-y-3">
                  {CATEGORIES.map(label => (
                    <label key={label} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(label)}
                        onChange={() => toggleCategory(label)}
                        className="w-4 h-4 border-luxe-champagne/30 text-luxe-gold focus:ring-luxe-gold rounded-sm" 
                      />
                      <span className={cn(
                        "text-[10px] uppercase tracking-widest transition-colors",
                        selectedCategories.includes(label) ? "text-luxe-gold font-bold" : "group-hover:text-luxe-gold"
                      )}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxe-champagne">Tông màu</p>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map(color => (
                    <button 
                      key={color.hex} 
                      onClick={() => setSelectedColor(selectedColor === color.hex ? null : color.hex)}
                      className={cn(
                        "w-8 h-8 rounded-full ring-1 ring-luxe-champagne/20 transition-all shadow-sm relative",
                        selectedColor === color.hex ? "ring-2 ring-luxe-gold scale-110" : "hover:ring-luxe-gold"
                      )} 
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                    >
                      {selectedColor === color.hex && (
                        <span className="absolute inset-0 flex items-center justify-center text-white">
                          <X size={12} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={clearFilters}
                className="w-full py-4 border border-luxe-champagne/30 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-luxe-champagne hover:text-white transition-all"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-6 border-b border-luxe-champagne/10 gap-4">
              <p className="text-[10px] uppercase tracking-widest text-luxe-text/60">
                Hiển thị <span className="font-bold text-luxe-black">{filteredProducts.length}</span> trên <span className="font-bold text-luxe-black">{PRODUCTS.length}</span> sản phẩm
              </p>
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-widest text-luxe-text/60">Sắp xếp:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-[10px] uppercase tracking-widest border-none bg-transparent focus:ring-0 cursor-pointer font-bold text-luxe-gold"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                </select>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((item) => (
                  <div key={item.id} className="group bg-luxe-ivory border border-luxe-mid hover:shadow-2xl hover:shadow-luxe-gold/10 transition-all duration-500 cursor-pointer" onClick={() => onNavigate('detail')}>
                    <div className="aspect-[4/5] overflow-hidden relative">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                      {item.tag && <span className="absolute top-4 left-4 bg-luxe-gold text-white text-[9px] uppercase tracking-widest px-3 py-1">{item.tag}</span>}
                    </div>
                    <div className="p-8">
                      <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-luxe-champagne mb-3">{item.cat}</p>
                      <h4 className="font-serif text-2xl mb-4 group-hover:text-luxe-gold transition-colors line-clamp-2 h-16">{item.title}</h4>
                      <div className="flex items-center justify-between">
                        <p className="font-serif text-luxe-gold text-xl">{item.priceStr} <span className="text-[10px] text-luxe-text/60 font-sans tracking-widest uppercase italic">/ m²</span></p>
                        <button className="text-[10px] uppercase tracking-widest border-b border-luxe-champagne/30 pb-1 hover:border-luxe-gold hover:text-luxe-gold transition-all">Chi Tiết</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-luxe-text opacity-60 italic">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
                <button onClick={clearFilters} className="mt-6 text-luxe-gold uppercase text-[10px] tracking-widest font-bold border-b border-luxe-gold pb-1">Xóa bộ lọc</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetailPage = ({ onNavigate, onConsult }: { onNavigate: (p: Page) => void, onConsult: () => void }) => {
  return (
    <div className="pt-32 pb-24 animate-in fade-in zoom-in-95 duration-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-luxe-champagne font-medium mb-12">
          <button onClick={() => onNavigate('home')} className="hover:text-luxe-gold transition-colors">Trang chủ</button>
          <span className="h-[1px] w-4 bg-luxe-champagne/30"></span>
          <button onClick={() => onNavigate('list')} className="hover:text-luxe-gold transition-colors">Sàn Nhà</button>
          <span className="h-[1px] w-4 bg-luxe-champagne/30"></span>
          <span className="text-luxe-black">Sàn Gỗ Sồi Mỹ</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
          <div className="space-y-6">
            <div className="aspect-[4/5] overflow-hidden bg-luxe-mid relative group">
              <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80" alt="Sàn gỗ sồi mỹ" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
              <span className="absolute top-6 left-6 bg-luxe-black text-white text-[9px] uppercase tracking-[0.3em] px-4 py-1.5">Best Seller</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square border border-luxe-champagne/10 hover:border-luxe-champagne transition-colors cursor-pointer overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&sig=${i}`} alt="Detail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-[1px] w-12 bg-luxe-champagne"></div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-luxe-champagne font-medium">Sàn Gỗ Tự Nhiên Bắc Mỹ</span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-light text-luxe-black leading-[1.1] mb-8">
              Sàn Gỗ <br />
              <span className="text-luxe-gold">Sồi Mỹ</span> Nhập Khẩu
            </h1>
            <div className="flex items-baseline gap-6 mb-10">
              <span className="font-serif text-4xl text-luxe-gold">1.250.000₫ <span className="text-sm font-sans tracking-widest uppercase">/ m²</span></span>
              <span className="text-luxe-text/40 line-through text-lg italic">1.500.000₫</span>
              <span className="bg-luxe-champagne/10 text-luxe-gold px-3 py-1 text-[10px] uppercase tracking-widest font-bold">Giảm 15%</span>
            </div>
            <p className="text-luxe-text text-base leading-relaxed opacity-80 mb-12 max-w-lg">
              Chế tác từ gỗ sồi trắng tuyển chọn nhập khẩu trực tiếp từ vùng rừng Bắc Mỹ. Qua quy trình xử lý tẩm sấy hiện đại chuẩn quốc tế, mang lại vẻ đẹp vĩnh cửu và sự ấm áp sang trọng cho dinh thự của bạn.
            </p>
            <div className="grid grid-cols-3 gap-6 mb-12">
              {[
                { icon: 'water_drop', label: 'Kháng nước' },
                { icon: 'verified', label: 'Chống trầy' },
                { icon: 'workspace_premium', label: 'Bảo hành 5 năm' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center p-6 bg-luxe-cream border border-luxe-champagne/10">
                  <span className="material-symbols-outlined text-luxe-gold mb-3 text-3xl">{item.icon}</span>
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-luxe-text">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <button 
                onClick={onConsult}
                className="bg-luxe-black text-white px-10 py-5 text-[11px] uppercase tracking-[0.2em] hover:bg-luxe-gold transition-colors duration-300"
              >
                Liên hệ tư vấn miễn phí
              </button>
              <button className="border border-luxe-champagne text-luxe-gold px-10 py-5 text-[11px] uppercase tracking-[0.2em] hover:bg-luxe-champagne hover:text-white transition-all duration-300">
                Yêu cầu báo giá chi tiết
              </button>
            </div>
          </div>
        </div>

        {/* Technical Specs */}
        <section className="py-24 border-y border-luxe-champagne/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-[10px] uppercase tracking-[0.4em] text-luxe-champagne font-bold block mb-4">Thông tin kỹ thuật</span>
              <h2 className="font-serif text-4xl lg:text-5xl font-light text-luxe-black">Chi Tiết Sản Phẩm</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
              <div>
                <ul className="space-y-6">
                  {[
                    { label: 'Kích thước', val: '15 x 120 x 900 mm' },
                    { label: 'Độ dày lớp mặt', val: '3 mm' },
                    { label: 'Độ ẩm tiêu chuẩn', val: '8% - 12%' },
                    { label: 'Công nghệ hèm', val: 'Uni-click Technology' },
                    { label: 'Sơn phủ bề mặt', val: 'UV Treffert (Đức) 7 lớp' }
                  ].map((row, idx) => (
                    <li key={idx} className="flex justify-between border-b border-luxe-champagne/10 pb-4">
                      <span className="text-[10px] uppercase tracking-widest text-luxe-text/60">{row.label}</span>
                      <span className="font-serif text-lg text-luxe-black">{row.val}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-luxe-cream p-10 border border-luxe-champagne/10">
                <h3 className="font-serif text-2xl text-luxe-gold mb-6">Đặc Tính Ưu Việt</h3>
                <p className="text-luxe-text text-sm leading-relaxed mb-8 opacity-70">
                  Tâm gỗ sồi Mỹ chứa hàm lượng tannin cao, tạo nên khả năng kháng sâu mọt tự nhiên vượt trội. Sản phẩm lý tưởng cho điều kiện khí hậu nồm ẩm đặc thù tại Việt Nam.
                </p>
                <div className="space-y-4">
                  {['Bền màu trên 25 năm sử dụng', 'Đạt chứng chỉ an toàn E0 quốc tế', 'Chống cong vênh co ngót tuyệt đối'].map(text => (
                    <div key={text} className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-luxe-gold text-sm">verified</span>
                      <p className="text-xs uppercase tracking-widest leading-loose text-luxe-text">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="py-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-serif text-3xl">Sản Phẩm Tương Tự</h2>
            <button onClick={() => onNavigate('list')} className="text-[10px] uppercase tracking-widest text-luxe-gold border-b border-luxe-champagne/40 pb-1 hover:border-luxe-gold transition-all">Xem tất cả →</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: 'Sàn Gỗ Sồi Nga', price: '1.150.000₫', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80' },
              { title: 'Sàn Gỗ Gõ Đỏ', price: '2.450.000₫', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80' },
              { title: 'Sàn Gỗ Walnut', price: '1.850.000₫', img: 'https://images.unsplash.com/photo-1581850518616-bcb8186c443e?auto=format&fit=crop&q=80' },
              { title: 'Sàn Gỗ Chiu Liu', price: '1.650.000₫', img: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80' }
            ].map((item, idx) => (
              <div key={idx} className="group cursor-pointer" onClick={() => onNavigate('detail')}>
                <div className="aspect-square overflow-hidden mb-6 bg-luxe-mid">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                </div>
                <h4 className="font-serif text-lg mb-2 group-hover:text-luxe-gold transition-colors">{item.title}</h4>
                <p className="text-luxe-gold font-serif">{item.price}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const SearchPage = ({ onNavigate, query }: { onNavigate: (p: Page) => void, query: string }) => {
  const filteredProducts = PRODUCTS.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) || 
    p.cat.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="pt-32 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-16 border-b border-luxe-champagne/10 pb-12">
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-luxe-champagne font-bold mb-4">
            <Search size={14} />
            Kết quả tìm kiếm
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-light">
            Tìm thấy <span className="text-luxe-gold">{filteredProducts.length}</span> kết quả cho <span className="italic">"{query}"</span>
          </h1>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((item) => (
              <div key={item.id} className="group bg-luxe-ivory border border-luxe-mid hover:shadow-2xl hover:shadow-luxe-gold/10 transition-all duration-500 cursor-pointer" onClick={() => onNavigate('detail')}>
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  {item.tag && <span className="absolute top-4 left-4 bg-luxe-gold text-white text-[9px] uppercase tracking-widest px-3 py-1">{item.tag}</span>}
                </div>
                <div className="p-6">
                  <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-luxe-champagne mb-2">{item.cat}</p>
                  <h4 className="font-serif text-xl mb-4 group-hover:text-luxe-gold transition-colors line-clamp-2 h-14">{item.title}</h4>
                  <p className="font-serif text-luxe-gold text-lg">{item.priceStr}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-luxe-cream border border-luxe-champagne/10">
            <Search size={48} className="mx-auto text-luxe-champagne/30 mb-6" />
            <h3 className="font-serif text-3xl mb-4">Rất tiếc, không tìm thấy kết quả</h3>
            <p className="text-luxe-text opacity-60 mb-10">Hãy thử tìm kiếm với từ khóa khác hoặc quay lại trang sản phẩm.</p>
            <button 
              onClick={() => onNavigate('list')}
              className="bg-luxe-black text-white px-10 py-4 text-[11px] uppercase tracking-widest hover:bg-luxe-gold transition-all"
            >
              Xem Tất Cả Sản Phẩm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectsPage = ({ onNavigate, onSelectProject }: { onNavigate: (p: Page) => void, onSelectProject: (id: string) => void }) => {
  return (
    <div className="pt-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Banner */}
      <section className="relative h-[400px] w-full overflow-hidden bg-luxe-black">
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')" }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="h-[1px] w-8 bg-luxe-gold"></div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-luxe-gold font-medium">Công Trình Thực Tế</span>
              <div className="h-[1px] w-8 bg-luxe-gold"></div>
            </div>
            <h2 className="font-serif text-5xl md:text-7xl font-light text-white tracking-wide mb-6">Dự Án <span className="text-luxe-gold">Tiêu Biểu</span></h2>
            <p className="text-white/60 text-sm uppercase tracking-[0.2em]">Khám phá không gian sống được kiến tạo bởi Hoangan Decor</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {PROJECTS_DATA.map((project, idx) => (
            <div 
              key={idx} 
              className="group cursor-pointer"
              onClick={() => { onSelectProject(project.id); onNavigate('project-detail'); }}
            >
              <div className="aspect-[16/10] overflow-hidden mb-8 relative">
                <img src={project.img} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-luxe-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                <span className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm text-luxe-black text-[9px] uppercase tracking-widest px-4 py-2 font-bold">
                  {project.category}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin size={14} className="text-luxe-gold" />
                  <span className="text-[10px] uppercase tracking-widest text-luxe-text/60 font-medium">{project.location}</span>
                </div>
                <h3 className="font-serif text-2xl group-hover:text-luxe-gold transition-colors">{project.title}</h3>
                <p className="text-luxe-text text-sm leading-relaxed opacity-70 line-clamp-2">{project.desc}</p>
                <button className="text-[10px] uppercase tracking-widest font-bold border-b border-luxe-champagne/30 pb-1 group-hover:border-luxe-gold group-hover:text-luxe-gold transition-all">
                  Xem chi tiết dự án
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectDetailPage = ({ onNavigate, projectId, onSelectProject, onOpenConsult }: { onNavigate: (p: Page) => void, projectId: string | null, onSelectProject: (id: string) => void, onOpenConsult: (title: string) => void }) => {
  const project = PROJECTS_DATA.find(p => p.id === projectId) || PROJECTS_DATA[0];
  const [activeImage, setActiveImage] = React.useState(project.img);

  React.useEffect(() => {
    setActiveImage(project.img);
  }, [project]);

  const allImages = [project.img, ...project.gallery];

  return (
    <div className="pt-32 pb-24 animate-in fade-in zoom-in-95 duration-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-luxe-champagne font-medium mb-12">
          <button onClick={() => onNavigate('home')} className="hover:text-luxe-gold transition-colors">Trang chủ</button>
          <span className="h-[1px] w-4 bg-luxe-champagne/30"></span>
          <button onClick={() => onNavigate('projects')} className="hover:text-luxe-gold transition-colors">Dự án</button>
          <span className="h-[1px] w-4 bg-luxe-champagne/30"></span>
          <span className="text-luxe-black">{project.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
          <div className="space-y-6">
            <div className="aspect-[4/3] overflow-hidden bg-luxe-mid relative group">
              <img src={activeImage} alt={project.title} className="w-full h-full object-cover transition-all duration-700" referrerPolicy="no-referrer" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {allImages.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={cn(
                    "aspect-square border transition-all cursor-pointer overflow-hidden",
                    activeImage === img ? "border-luxe-gold" : "border-luxe-champagne/10 hover:border-luxe-champagne"
                  )}
                >
                  <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-[1px] w-12 bg-luxe-champagne"></div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-luxe-champagne font-medium">{project.category}</span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-light text-luxe-black leading-[1.1] mb-8">
              {project.title}
            </h1>
            <div className="flex items-center gap-3 mb-10">
              <MapPin size={18} className="text-luxe-gold" />
              <span className="text-sm uppercase tracking-widest text-luxe-text/60 font-medium">{project.location}</span>
            </div>
            <p className="text-luxe-text text-base leading-relaxed opacity-80 mb-12">
              {project.fullDesc}
            </p>
            
            <div className="grid grid-cols-2 gap-12 py-10 border-y border-luxe-champagne/10 mb-12">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-luxe-champagne font-bold mb-2">Hạng mục thi công</p>
                <p className="text-luxe-black font-serif text-lg">{project.category}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-luxe-champagne font-bold mb-2">Trạng thái</p>
                <p className="text-luxe-black font-serif text-lg">Đã hoàn thành</p>
              </div>
            </div>

            <button 
              onClick={() => onOpenConsult(project.title)}
              className="bg-luxe-black text-white px-10 py-5 text-[11px] uppercase tracking-[0.2em] hover:bg-luxe-gold transition-colors duration-300 self-start"
            >
              Tư vấn dự án tương tự
            </button>
          </div>
        </div>

        {/* Other Projects */}
        <section className="py-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-serif text-3xl">Các Dự Án Khác</h2>
            <button onClick={() => onNavigate('projects')} className="text-[10px] uppercase tracking-widest text-luxe-gold border-b border-luxe-champagne/40 pb-1 hover:border-luxe-gold transition-all">Xem tất cả →</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROJECTS_DATA.filter(p => p.id !== projectId).slice(0, 3).map((item, idx) => (
              <div 
                key={idx} 
                className="group cursor-pointer" 
                onClick={() => { 
                  onSelectProject(item.id);
                  onNavigate('project-detail'); 
                  window.scrollTo(0, 0);
                }}
              >
                <div className="aspect-[16/10] overflow-hidden mb-6 bg-luxe-mid">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                </div>
                <h4 className="font-serif text-xl mb-2 group-hover:text-luxe-gold transition-colors">{item.title}</h4>
                <p className="text-luxe-text/60 text-[10px] uppercase tracking-widest">{item.location}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const ConsultModal = ({ isOpen, onClose, projectTitle }: { isOpen: boolean, onClose: () => void, projectTitle: string | null }) => {
  const [formData, setFormData] = React.useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone.trim() || !formData.name.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', phone: '' });
        onClose();
      }, 3000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-luxe-black/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-white p-10 shadow-2xl overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-luxe-black/40 hover:text-luxe-gold transition-colors">
          <X size={24} />
        </button>

        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-[1px] w-8 bg-luxe-gold"></div>
            <span className="text-[10px] uppercase tracking-widest text-luxe-gold font-bold">Yêu cầu tư vấn</span>
          </div>
          <h3 className="font-serif text-3xl text-luxe-black mb-2">Dự án tương tự</h3>
          <p className="text-luxe-text/60 text-xs uppercase tracking-widest font-medium">{projectTitle}</p>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h4 className="font-serif text-2xl mb-2">Gửi thành công!</h4>
            <p className="text-luxe-text opacity-70 text-sm">Chúng tôi sẽ gọi lại cho bạn trong vòng 30 phút.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-luxe-champagne font-bold mb-2">
                Họ và tên <span className="text-luxe-text/40 normal-case font-normal italic ml-2">(Chúng tôi gọi bạn là gì?)</span>
              </label>
              <input 
                autoFocus
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên của bạn..."
                className="w-full border-b border-luxe-champagne/30 py-3 text-luxe-black placeholder:text-luxe-black/20 outline-none focus:border-luxe-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-luxe-champagne font-bold mb-2">Số điện thoại</label>
              <input 
                type="tel" 
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Nhập số điện thoại..."
                className="w-full border-b border-luxe-champagne/30 py-3 text-luxe-black placeholder:text-luxe-black/20 outline-none focus:border-luxe-gold transition-colors"
              />
            </div>
            <button 
              disabled={isSubmitting}
              className="w-full bg-luxe-black text-white py-5 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-luxe-gold transition-colors duration-300 disabled:opacity-50 mt-4"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Gửi yêu cầu ngay'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

const SearchOverlay = ({ isOpen, onClose, onNavigate, onSearch }: { isOpen: boolean, onClose: () => void, onNavigate: (p: Page) => void, onSearch: (q: string) => void }) => {
  const [query, setQuery] = React.useState('');
  
  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      onNavigate('search');
      onClose();
    }
  };

  const mockResults = PRODUCTS.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.cat.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="fixed inset-0 z-[100] bg-luxe-black/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute top-8 right-8">
        <button onClick={onClose} className="text-white hover:text-luxe-gold transition-colors">
          <X size={32} />
        </button>
      </div>
      <div className="h-full flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-3xl">
          <form onSubmit={handleSearch} className="relative mb-12">
            <input 
              autoFocus
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..." 
              className="w-full bg-transparent border-b-2 border-luxe-champagne/30 py-6 text-3xl md:text-5xl font-serif text-white placeholder:text-white/20 outline-none focus:border-luxe-gold transition-colors"
            />
            <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-luxe-gold hover:scale-110 transition-transform">
              <Search size={32} />
            </button>
          </form>

          {query.length > 1 ? (
            <div className="animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-[10px] uppercase tracking-[0.3em] text-luxe-champagne font-bold">Gợi ý kết quả ({mockResults.length})</h4>
                <button 
                  onClick={handleSearch}
                  className="text-[10px] uppercase tracking-widest text-luxe-gold font-bold border-b border-luxe-gold/30 hover:border-luxe-gold transition-all"
                >
                  Xem tất cả kết quả
                </button>
              </div>
              <div className="space-y-6">
                {mockResults.length > 0 ? mockResults.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-6 group cursor-pointer"
                    onClick={() => { onNavigate('detail'); onClose(); }}
                  >
                    <div className="w-20 h-20 overflow-hidden bg-luxe-mid">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                  </div>
                )) : (
                  <p className="text-white/40 text-center py-12">Không tìm thấy kết quả phù hợp</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = React.useState<Page>('home');
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null);
  const [isConsultModalOpen, setIsConsultModalOpen] = React.useState(false);
  const [consultProjectTitle, setConsultProjectTitle] = React.useState<string | null>(null);

  const scrollToContact = () => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById('contact-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('contact-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleOpenConsult = (title: string) => {
    setConsultProjectTitle(title);
    setIsConsultModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onNavigate={setCurrentPage} 
        currentPage={currentPage} 
        onSearchClick={() => setIsSearchOpen(true)}
      />
      
      <main className="flex-grow">
        {currentPage === 'home' && <HomePage onNavigate={setCurrentPage} onConsult={scrollToContact} onSelectProject={setSelectedProjectId} />}
        {currentPage === 'list' && <ProductListPage onNavigate={setCurrentPage} />}
        {currentPage === 'detail' && <ProductDetailPage onNavigate={setCurrentPage} onConsult={scrollToContact} />}
        {currentPage === 'projects' && <ProjectsPage onNavigate={setCurrentPage} onSelectProject={setSelectedProjectId} />}
        {currentPage === 'project-detail' && <ProjectDetailPage onNavigate={setCurrentPage} projectId={selectedProjectId} onSelectProject={setSelectedProjectId} onOpenConsult={handleOpenConsult} />}
        {currentPage === 'search' && <SearchPage onNavigate={setCurrentPage} query={searchQuery} />}
      </main>

      <Footer onConsult={scrollToContact} />

      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onNavigate={setCurrentPage}
        onSearch={setSearchQuery}
      />

      <ConsultModal 
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
        projectTitle={consultProjectTitle}
      />

      {/* Floating Hotline Button */}
      <a 
        href="tel:0909123456" 
        className="fixed bottom-8 right-8 z-[60] flex items-center gap-3 bg-luxe-gold text-white px-6 py-4 rounded-full shadow-2xl shadow-luxe-gold/40 hover:scale-105 transition-transform duration-300 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
          <Phone size={24} fill="currentColor" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest font-bold leading-none mb-1">Tư vấn ngay</span>
          <span className="font-serif text-lg leading-none font-bold">0909 123 456</span>
        </div>
      </a>

      {/* Material Symbols Link */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    </div>
  );
}
