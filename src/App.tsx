import React from 'react';
import { Phone, Search, Menu, X, Facebook, Instagram, Youtube, MapPin, Mail, Clock, ChevronLeft, ChevronRight, LayoutDashboard, LogOut, Plus, Edit2, Trash2, Save, Settings, FileText, Package, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { db, auth } from './firebase';
import AdminPage, { UserProfile, Page, SiteSettings } from './AdminPage';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  getDoc, 
  setDoc,
  getDocs
} from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signOut,
  User
} from 'firebase/auth';

// --- Types ---
type Page = 'home' | 'list' | 'detail' | 'projects' | 'search' | 'admin';

interface Product {
  id: string;
  title: string;
  cat: string;
  price: number;
  priceStr: string;
  img: string;
  tag?: string;
  color?: string;
  description?: string;
}

interface Project {
  id: string;
  title: string;
  location: string;
  category: string;
  img: string;
  desc: string;
}

interface SiteSettings {
  hotline: string;
  footerText: string;
  address: string;
  email: string;
}

interface Consultation {
  id: string;
  phone: string;
  createdAt: any;
  status: 'pending' | 'contacted' | 'closed';
}

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

// --- Components ---

const Navbar = ({ onNavigate, currentPage, onSearchClick, user, settings }: { onNavigate: (p: Page) => void, currentPage: Page, onSearchClick: () => void, user: User | null, settings: SiteSettings | null }) => {
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
          {user && user.email === "vodkato.vodkanho@gmail.com" && (
            <li>
              <button 
                onClick={() => onNavigate('admin')}
                className={cn(
                  "relative transition-colors duration-300 hover:text-luxe-gold flex items-center gap-2",
                  currentPage === 'admin' && "text-luxe-gold"
                )}
              >
                <LayoutDashboard size={16} />
                Admin
              </button>
            </li>
          )}
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
              <p className="font-serif text-lg text-luxe-black tracking-wider leading-none font-bold">{settings?.hotline || '0909 123 456'}</p>
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

const Footer = ({ onConsult, settings }: { onConsult: () => void, settings: SiteSettings | null }) => (
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
            {settings?.footerText || 'Chuyên cung cấp vật liệu trang trí nội thất cao cấp — nơi phong cách và chất lượng giao thoa, kiến tạo không gian sống đẳng cấp.'}
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
              <span>{settings?.address || '123 Đường Lê Lợi, Quận 1, TP.HCM'}</span>
            </li>
            <li className="flex items-start space-x-3">
              <Phone size={14} className="text-luxe-champagne mt-0.5" />
              <span>{settings?.hotline || '0909 123 456'}</span>
            </li>
            <li className="flex items-start space-x-3">
              <Mail size={14} className="text-luxe-champagne mt-0.5" />
              <span>{settings?.email || 'contact@luxedecor.vn'}</span>
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

const HomePage = ({ onNavigate, onConsult }: { onNavigate: (p: Page) => void, onConsult: () => void }) => {
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);
  const [phone, setPhone] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'consultations'), {
        phone: phone,
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      setIsSuccess(true);
      setPhone('');
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Error adding consultation: ", error);
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            <div className="group relative overflow-hidden h-[350px] cursor-pointer" onClick={() => onNavigate('list')}>
              <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80" alt="Phào chỉ" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 cat-card-overlay flex flex-col justify-end p-8">
                <h3 className="font-serif text-2xl text-white mb-1">Phào Chỉ</h3>
                <p className="text-white/60 text-[11px] tracking-wider uppercase mb-3">Trang Trí • Cổ Điển</p>
                <span className="text-white text-[10px] transition-transform duration-300 group-hover:translate-x-2">→ Khám phá</span>
              </div>
            </div>
            <div className="group relative overflow-hidden h-[350px] cursor-pointer" onClick={() => onNavigate('list')}>
              <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80" alt="Rèm cửa" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 cat-card-overlay flex flex-col justify-end p-8">
                <h3 className="font-serif text-2xl text-white mb-1">Rèm Cửa</h3>
                <p className="text-white/60 text-[11px] tracking-wider uppercase mb-3">Cao Cấp • Sang Trọng</p>
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

const ProductDetailPage = ({ onNavigate, onConsult, settings }: { onNavigate: (p: Page) => void, onConsult: () => void, settings: SiteSettings | null }) => {
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

const ProjectsPage = ({ onNavigate }: { onNavigate: (p: Page) => void }) => {
  const projects = [
    {
      title: 'Biệt Thự Vinhomes Riverside',
      location: 'Long Biên, Hà Nội',
      category: 'Sàn Gỗ Tự Nhiên',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
      desc: 'Thi công trọn gói sàn gỗ Gõ Đỏ Lào cho toàn bộ không gian 3 tầng biệt thự.'
    },
    {
      title: 'Penthouse Sunshine City',
      location: 'Tây Hồ, Hà Nội',
      category: 'Tấm Ốp Tường & Rèm',
      img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80',
      desc: 'Sử dụng tấm ốp Nano vân đá kết hợp rèm cửa voan cao cấp tạo không gian hiện đại.'
    },
    {
      title: 'Nhà Hàng Sen Tây Hồ',
      location: 'Tây Hồ, Hà Nội',
      category: 'Sàn Nhựa SPC',
      img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
      desc: 'Lắp đặt sàn nhựa SPC chịu lực cao cho khu vực sảnh chính và phòng VIP.'
    },
    {
      title: 'Căn Hộ Goldmark City',
      location: 'Bắc Từ Liêm, Hà Nội',
      category: 'Giấy Dán Tường & Phào Chỉ',
      img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80',
      desc: 'Trang trí phòng ngủ với giấy dán tường Hàn Quốc và phào chỉ tân cổ điển.'
    },
    {
      title: 'Văn Phòng Techcombank',
      location: 'Hoàn Kiếm, Hà Nội',
      category: 'Thảm Cỏ & Sàn Gỗ',
      img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
      desc: 'Kiến tạo không gian xanh với thảm cỏ nhân tạo và sàn gỗ công nghiệp cao cấp.'
    },
    {
      title: 'Showroom Mercedes-Benz',
      location: 'Hải Phòng',
      category: 'Sàn Nhựa Vinyl',
      img: 'https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?auto=format&fit=crop&q=80',
      desc: 'Sàn nhựa Vinyl chống trượt, chịu tải trọng lớn cho khu vực trưng bày xe.'
    }
  ];

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
          {projects.map((project, idx) => (
            <div key={idx} className="group cursor-pointer">
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

                  {consultations.map(item => (
                    <tr key={item.id} className="hover:bg-luxe-cream/50 transition-colors">
                      <td className="px-6 py-4 text-xs">
                        {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString('vi-VN') : 'Đang xử lý...'}
                      </td>
                      <td className="px-6 py-4 font-serif text-lg">{item.phone}</td>
                      <td className="px-6 py-4">
                        <select 
                          value={item.status}
                          onChange={async (e) => {
                            try {
                              await updateDoc(doc(db, 'consultations', item.id), { status: e.target.value });
                            } catch (err) { console.error(err); }
                          }}
                          className={cn(
                            "text-[10px] uppercase tracking-widest font-bold border-none bg-transparent focus:ring-0 cursor-pointer",
                            item.status === 'pending' ? "text-amber-500" : 
                            item.status === 'contacted' ? "text-blue-500" : "text-emerald-500"
                          )}
                        >
                          <option value="pending">Chờ xử lý</option>
                          <option value="contacted">Đã liên hệ</option>
                          <option value="closed">Hoàn tất</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete('consultations', item.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-2xl">Quản lý danh mục</h3>
              <button 
                onClick={() => { setShowForm(true); setEditingId(null); }}
                className="bg-luxe-gold text-white px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-luxe-black transition-all flex items-center gap-2"
              >
                <Plus size={16} /> Thêm danh mục
              </button>
            </div>

            {showForm && (
              <div className="bg-white border border-luxe-champagne/10 p-8 shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-serif text-xl">{editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h4>
                  <button onClick={() => setShowForm(false)} className="text-luxe-text/40 hover:text-red-500"><XCircle size={20} /></button>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleSave('categories', {
                    name: formData.get('name'),
                    slug: formData.get('slug') || (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-')
                  });
                }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Tên danh mục</label>
                    <input name="name" required defaultValue={editingId ? categories.find(c => c.id === editingId)?.name : ''} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Slug (Tùy chọn)</label>
                    <input name="slug" defaultValue={editingId ? categories.find(c => c.id === editingId)?.slug : ''} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="bg-luxe-black text-white px-8 py-4 text-[11px] uppercase tracking-widest hover:bg-luxe-gold transition-all">Lưu danh mục</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white border border-luxe-champagne/10 p-6 flex justify-between items-center group hover:border-luxe-gold transition-all">
                  <div>
                    <h4 className="font-serif text-lg text-luxe-black">{cat.name}</h4>
                    <p className="text-[10px] text-luxe-text/40 uppercase tracking-widest">{cat.slug}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingId(cat.id!); setShowForm(true); }} className="text-luxe-gold hover:text-luxe-black"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete('categories', cat.id!)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-2xl">Quản lý sản phẩm</h3>
              <button 
                onClick={() => { setShowForm(true); setEditingId(null); }}
                className="bg-luxe-gold text-white px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-luxe-black transition-all flex items-center gap-2"
              >
                <Plus size={16} /> Thêm sản phẩm
              </button>
            </div>

            {showForm && (
              <div className="bg-white border border-luxe-champagne/10 p-8 shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-serif text-xl">{editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h4>
                  <button onClick={() => setShowForm(false)} className="text-luxe-text/40 hover:text-red-500"><XCircle size={20} /></button>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const price = Number(formData.get('price'));
                  handleSave('products', {
                    title: formData.get('title'),
                    cat: formData.get('cat'),
                    price: price,
                    priceStr: price.toLocaleString('vi-VN') + '₫',
                    img: formData.get('img'),
                    tag: formData.get('tag'),
                    description: formData.get('description')
                  });
                }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Tên sản phẩm</label>
                    <input name="title" required defaultValue={editingId ? products.find(p => p.id === editingId)?.title : ''} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Danh mục</label>
                    <select name="cat" required defaultValue={editingId ? products.find(p => p.id === editingId)?.cat : ''} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none">
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Giá (m²)</label>
                    <input name="price" type="number" required defaultValue={editingId ? products.find(p => p.id === editingId)?.price : ''} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Link ảnh</label>
                    <input name="img" required defaultValue={editingId ? products.find(p => p.id === editingId)?.img : ''} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Mô tả</label>
                    <textarea name="description" rows={3} defaultValue={editingId ? products.find(p => p.id === editingId)?.description : ''} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="bg-luxe-black text-white px-8 py-4 text-[11px] uppercase tracking-widest hover:bg-luxe-gold transition-all">Lưu sản phẩm</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {products.map(product => (
                <div key={product.id} className="bg-white border border-luxe-champagne/10 group hover:border-luxe-gold transition-all overflow-hidden">
                  <div className="aspect-square bg-luxe-mid relative">
                    <img src={product.img} alt={product.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingId(product.id!); setShowForm(true); }} className="p-2 bg-white text-luxe-gold rounded-full shadow-lg"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete('products', product.id!)} className="p-2 bg-white text-red-500 rounded-full shadow-lg"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[9px] uppercase tracking-widest text-luxe-gold font-bold mb-1">{product.cat}</p>
                    <h4 className="font-serif text-base text-luxe-black mb-2 line-clamp-1">{product.title}</h4>
                    <p className="text-luxe-gold font-bold">{product.priceStr}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-2xl">Quản lý dự án</h3>
              <button 
                onClick={() => { setShowForm(true); setEditingId(null); }}
                className="bg-luxe-gold text-white px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-luxe-black transition-all flex items-center gap-2"
              >
                <Plus size={16} /> Thêm dự án
              </button>
            </div>

            {showForm && (
              <div className="bg-white border border-luxe-champagne/10 p-8 shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-serif text-xl">{editingId ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}</h4>
                  <button onClick={() => setShowForm(false)} className="text-luxe-text/40 hover:text-red-500"><XCircle size={20} /></button>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleSave('projects', {
                    title: formData.get('title'),
                    location: formData.get('location'),
                    category: formData.get('category'),
                    img: formData.get('img'),
                    desc: formData.get('desc')
                  });
                }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Tên dự án</label>
                    <input name="title" required defaultValue={editingId ? projects.find(p => p.id === editingId)?.title : ''} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Địa điểm</label>
                    <input name="location" required defaultValue={editingId ? projects.find(p => p.id === editingId)?.location : ''} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Loại hình</label>
                    <input name="category" required defaultValue={editingId ? projects.find(p => p.id === editingId)?.category : ''} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Link ảnh</label>
                    <input name="img" required defaultValue={editingId ? projects.find(p => p.id === editingId)?.img : ''} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Mô tả ngắn</label>
                    <textarea name="desc" rows={3} defaultValue={editingId ? projects.find(p => p.id === editingId)?.desc : ''} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="bg-luxe-black text-white px-8 py-4 text-[11px] uppercase tracking-widest hover:bg-luxe-gold transition-all">Lưu dự án</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {projects.map(project => (
                <div key={project.id} className="bg-white border border-luxe-champagne/10 group hover:border-luxe-gold transition-all overflow-hidden">
                  <div className="aspect-[16/10] bg-luxe-mid relative">
                    <img src={project.img} alt={project.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingId(project.id!); setShowForm(true); }} className="p-2 bg-white text-luxe-gold rounded-full shadow-lg"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete('projects', project.id!)} className="p-2 bg-white text-red-500 rounded-full shadow-lg"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] uppercase tracking-widest text-luxe-gold font-bold">{project.category}</span>
                      <span className="w-1 h-1 bg-luxe-champagne rounded-full"></span>
                      <span className="text-[9px] uppercase tracking-widest text-luxe-text/60">{project.location}</span>
                    </div>
                    <h4 className="font-serif text-xl text-luxe-black mb-3">{project.title}</h4>
                    <p className="text-xs text-luxe-text/60 line-clamp-2">{project.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && user.role === 'admin' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-2xl">Quản lý người dùng</h3>
              <button 
                onClick={() => { setShowForm(true); setEditingId(null); }}
                className="bg-luxe-gold text-white px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-luxe-black transition-all flex items-center gap-2"
              >
                <UserPlus size={16} /> Thêm người dùng
              </button>
            </div>

            {showForm && (
              <div className="bg-white border border-luxe-champagne/10 p-8 shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-serif text-xl">{editingId ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h4>
                  <button onClick={() => setShowForm(false)} className="text-luxe-text/40 hover:text-red-500"><XCircle size={20} /></button>
                </div>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const email = formData.get('email') as string;
                  const role = formData.get('role') as any;
                  const displayName = formData.get('displayName') as string;
                  const password = formData.get('password') as string;

                  try {
                    if (editingId) {
                      await updateDoc(doc(db, 'users', editingId), { displayName, role });
                    } else {
                      // Note: Creating a user in Firebase Auth from client is tricky if we want to stay logged in as admin.
                      // For this demo, we'll just create the document. In a real app, you'd use a Cloud Function.
                      // But since we are using email/password, we can try to create it.
                      // WARNING: This will sign out the current admin! 
                      // Better approach: Just save to Firestore and tell admin to have user sign up or use a function.
                      // For now, let's just save the profile.
                      await setDoc(doc(db, 'users', email.replace(/[@.]/g, '_')), {
                        email,
                        displayName,
                        role,
                        createdAt: serverTimestamp()
                      });
                      alert('Đã tạo hồ sơ người dùng. Người dùng này cần đăng ký tài khoản với email này để truy cập.');
                    }
                    setShowForm(false);
                  } catch (err) { console.error(err); }
                }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Email</label>
                    <input name="email" type="email" required disabled={!!editingId} defaultValue={editingId ? users.find(u => u.id === editingId)?.email : ''} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none disabled:bg-luxe-mid" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Tên hiển thị</label>
                    <input name="displayName" required defaultValue={editingId ? users.find(u => u.id === editingId)?.displayName : ''} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Vai trò</label>
                    <select name="role" required defaultValue={editingId ? users.find(u => u.id === editingId)?.role : 'editor'} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none">
                      <option value="admin">Admin (Toàn quyền)</option>
                      <option value="editor">Editor (Chỉ sửa nội dung)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="bg-luxe-black text-white px-8 py-4 text-[11px] uppercase tracking-widest hover:bg-luxe-gold transition-all">Lưu người dùng</button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white border border-luxe-champagne/10 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-luxe-text/60 border-b border-luxe-champagne/10">
                    <th className="px-6 py-4 font-bold">Người dùng</th>
                    <th className="px-6 py-4 font-bold">Vai trò</th>
                    <th className="px-6 py-4 font-bold">Ngày tạo</th>
                    <th className="px-6 py-4 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxe-champagne/10">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-luxe-cream/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-luxe-gold/10 text-luxe-gold rounded-full flex items-center justify-center text-xs font-bold">
                            {u.displayName?.charAt(0) || u.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{u.displayName || 'Chưa đặt tên'}</p>
                            <p className="text-[10px] text-luxe-text/40">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-full",
                          u.role === 'admin' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                        )}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-luxe-text/60">
                        {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString('vi-VN') : '---'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => { setEditingId(u.id); setShowForm(true); }} className="text-luxe-gold hover:text-luxe-black"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete('users', u.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <div className="bg-white border border-luxe-champagne/10 p-10 shadow-sm">
              <h3 className="font-serif text-2xl mb-8 border-b border-luxe-champagne/10 pb-4">Cấu hình Website</h3>
              <form className="space-y-6" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  hotline: formData.get('hotline'),
                  email: formData.get('email'),
                  address: formData.get('address'),
                  footerText: formData.get('footerText'),
                };
                try {
                  await setDoc(doc(db, 'settings', 'global'), data);
                  alert('Đã cập nhật cấu hình!');
                } catch (err) {
                  console.error(err);
                }
              }}>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Số điện thoại Hotline</label>
                  <input name="hotline" defaultValue={settings?.hotline || '0909 123 456'} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Email liên hệ</label>
                  <input name="email" defaultValue={settings?.email || 'contact@luxedecor.vn'} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Địa chỉ văn phòng</label>
                  <input name="address" defaultValue={settings?.address || '123 Đường Lê Lợi, Quận 1, TP.HCM'} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Mô tả Footer</label>
                  <textarea name="footerText" rows={4} defaultValue={settings?.footerText || 'Chuyên cung cấp vật liệu trang trí nội thất cao cấp — nơi phong cách và chất lượng giao thoa, kiến tạo không gian sống đẳng cấp.'} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none" />
                </div>
                <button type="submit" className="w-full bg-luxe-black text-white py-4 text-[11px] uppercase tracking-widest hover:bg-luxe-gold transition-all flex items-center justify-center gap-3">
                  <Save size={16} />
                  Lưu cấu hình
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Email liên hệ</label>
                  <input name="email" defaultValue={settings?.email || 'contact@luxedecor.vn'} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Địa chỉ văn phòng</label>
                  <input name="address" defaultValue={settings?.address || '123 Đường Lê Lợi, Quận 1, TP.HCM'} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Mô tả Footer</label>
                  <textarea name="footerText" rows={4} defaultValue={settings?.footerText || 'Chuyên cung cấp vật liệu trang trí nội thất cao cấp — nơi phong cách và chất lượng giao thoa, kiến tạo không gian sống đẳng cấp.'} className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none" />
                </div>
                <button type="submit" className="w-full bg-luxe-black text-white py-4 text-[11px] uppercase tracking-widest hover:bg-luxe-gold transition-all flex items-center justify-center gap-3">
                  <Save size={16} />
                  Lưu cấu hình
                </button>
              </form>
            </div>
          </div>
        )}

        {(activeTab === 'products' || activeTab === 'projects') && (
          <div className="bg-white border border-luxe-champagne/10 p-20 text-center shadow-sm">
            <LayoutDashboard size={48} className="mx-auto text-luxe-champagne/20 mb-6" />
            <h3 className="font-serif text-2xl mb-4">Tính năng đang phát triển</h3>
            <p className="text-luxe-text opacity-60 max-w-md mx-auto">Bạn có thể quản lý {activeTab === 'products' ? 'sản phẩm' : 'dự án'} trực tiếp trên Firebase Console trong lúc tôi hoàn thiện giao diện này.</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default function App() {
  const [currentPage, setCurrentPage] = React.useState<Page>('home');
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [settings, setSettings] = React.useState<SiteSettings | null>(null);

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
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', u.uid));
        if (userDoc.exists()) {
          setUser({ ...u, role: userDoc.data().role } as UserProfile);
        } else {
          // Fallback for default admin or first time login
          if (u.email === "vodkato.vodkanho@gmail.com") {
            setUser({ ...u, role: 'admin' } as UserProfile);
          } else {
            setUser(u as UserProfile);
          }
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as SiteSettings);
      }
    });
    return () => unsubSettings();
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onNavigate={setCurrentPage} 
        currentPage={currentPage} 
        onSearchClick={() => setIsSearchOpen(true)}
        user={user}
        settings={settings}
      />
      
      <main className="flex-grow">
        {currentPage === 'home' && <HomePage onNavigate={setCurrentPage} onConsult={scrollToContact} />}
        {currentPage === 'list' && <ProductListPage onNavigate={setCurrentPage} />}
        {currentPage === 'detail' && <ProductDetailPage onNavigate={setCurrentPage} onConsult={scrollToContact} settings={settings} />}
        {currentPage === 'projects' && <ProjectsPage onNavigate={setCurrentPage} />}
        {currentPage === 'search' && <SearchPage onNavigate={setCurrentPage} query={searchQuery} />}
        {currentPage === 'admin' && <AdminPage onNavigate={setCurrentPage} user={user} />}
      </main>

      <Footer onConsult={scrollToContact} settings={settings} />

      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onNavigate={setCurrentPage}
        onSearch={setSearchQuery}
      />

      {/* Floating Hotline Button */}
      <a 
        href={`tel:${settings?.hotline?.replace(/\s/g, '') || '0909123456'}`} 
        className="fixed bottom-8 right-8 z-[60] flex items-center gap-3 bg-luxe-gold text-white px-6 py-4 rounded-full shadow-2xl shadow-luxe-gold/40 hover:scale-105 transition-transform duration-300 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
          <Phone size={24} fill="currentColor" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest font-bold leading-none mb-1">Tư vấn ngay</span>
          <span className="font-serif text-lg leading-none font-bold">{settings?.hotline || '0909 123 456'}</span>
        </div>
      </a>

      {/* Material Symbols Link */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    </div>
  );
}
