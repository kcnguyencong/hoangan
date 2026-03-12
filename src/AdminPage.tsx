import React from 'react';
import { 
  LayoutDashboard, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  Settings, 
  FileText, 
  Package, 
  Users, 
  Layers, 
  UserPlus, 
  XCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { db, auth } from './firebase';
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
  setDoc
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { cn } from './lib/utils';

// --- Types ---
export type Page = 'home' | 'list' | 'detail' | 'projects' | 'search' | 'admin';

export interface Product {
  id?: string;
  title: string;
  cat: string;
  price: number;
  priceStr: string;
  img: string;
  tag?: string;
  color?: string;
  description?: string;
}

export interface Project {
  id?: string;
  title: string;
  location: string;
  category: string;
  img: string;
  desc: string;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
}

export interface SiteSettings {
  hotline: string;
  footerText: string;
  address: string;
  email: string;
}

export interface Consultation {
  id: string;
  phone: string;
  createdAt: any;
  status: 'pending' | 'contacted' | 'closed';
}

export interface AdminUser {
  id: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'editor';
  createdAt?: any;
}

export interface UserProfile extends FirebaseUser {
  role?: 'admin' | 'editor';
}

interface AdminPageProps {
  onNavigate: (p: Page) => void;
  user: UserProfile | null;
}

const AdminPage: React.FC<AdminPageProps> = ({ onNavigate, user }) => {
  const [activeTab, setActiveTab] = React.useState<'products' | 'projects' | 'consultations' | 'settings' | 'categories' | 'users'>('consultations');
  const [consultations, setConsultations] = React.useState<Consultation[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [settings, setSettings] = React.useState<SiteSettings | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loginError, setLoginError] = React.useState('');
  
  // Form states
  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) return;

    const unsubConsults = onSnapshot(query(collection(db, 'consultations'), orderBy('createdAt', 'desc')), (snapshot) => {
      setConsultations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Consultation)));
    });

    const unsubProducts = onSnapshot(query(collection(db, 'products'), orderBy('createdAt', 'desc')), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    });

    const unsubProjects = onSnapshot(query(collection(db, 'projects'), orderBy('createdAt', 'desc')), (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    });

    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) setSettings(doc.data() as SiteSettings);
    });

    let unsubUsers = () => {};
    if (user.role === 'admin') {
      unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminUser)));
      });
    }

    setLoading(false);

    return () => {
      unsubConsults();
      unsubProducts();
      unsubProjects();
      unsubCategories();
      unsubSettings();
      unsubUsers();
    };
  }, [user]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError('');
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setLoginError('Email hoặc mật khẩu không đúng.');
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    onNavigate('home');
  };

  // Generic CRUD helpers
  const handleSave = async (collectionName: string, data: any) => {
    try {
      if (editingId) {
        await updateDoc(doc(db, collectionName, editingId), data);
      } else {
        await addDoc(collection(db, collectionName), { ...data, createdAt: serverTimestamp() });
      }
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error(`Error saving to ${collectionName}`, error);
      alert('Có lỗi xảy ra khi lưu dữ liệu.');
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (error) {
        console.error(`Error deleting from ${collectionName}`, error);
      }
    }
  };

  if (!user) {
    return (
      <div className="pt-40 pb-24 flex flex-col items-center justify-center bg-luxe-ivory min-h-screen">
        <div className="bg-white p-12 border border-luxe-champagne/20 shadow-2xl max-w-md w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-luxe-gold/10 text-luxe-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <LayoutDashboard size={32} />
            </div>
            <h2 className="font-serif text-3xl mb-2">Hệ Thống Quản Trị</h2>
            <p className="text-luxe-text opacity-60 text-sm">Vui lòng đăng nhập để tiếp tục</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Email</label>
              <input 
                name="email" 
                type="email" 
                required 
                className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none transition-colors" 
                placeholder="admin@hoangandecor.vn"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-luxe-champagne">Mật khẩu</label>
              <input 
                name="password" 
                type="password" 
                required 
                className="w-full border border-luxe-champagne/20 px-4 py-3 text-sm focus:border-luxe-gold outline-none transition-colors" 
                placeholder="••••••••"
              />
            </div>
            {loginError && <p className="text-red-500 text-xs italic">{loginError}</p>}
            <button 
              type="submit"
              className="w-full bg-luxe-black text-white py-4 text-[11px] uppercase tracking-widest hover:bg-luxe-gold transition-all shadow-lg shadow-black/10"
            >
              Đăng nhập hệ thống
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-luxe-champagne/10 text-center">
            <p className="text-[10px] text-luxe-text/40 uppercase tracking-widest">Hoangan Decor &copy; 2026</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-luxe-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="font-serif text-4xl mb-2">Bảng Điều Khiển</h1>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-luxe-champagne font-bold">Quản trị viên: {user.displayName || user.email}</span>
              <span className="bg-luxe-gold/10 text-luxe-gold text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full">{user.role}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-red-500 font-bold border border-red-500/20 px-6 py-3 hover:bg-red-500 hover:text-white transition-all shadow-sm"
          >
            <LogOut size={14} />
            Đăng xuất
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-12 border-b border-luxe-champagne/10 pb-8">
          {[
            { id: 'consultations', label: 'Tư vấn', icon: Users },
            { id: 'categories', label: 'Danh mục', icon: Layers },
            { id: 'products', label: 'Sản phẩm', icon: Package },
            { id: 'projects', label: 'Dự án', icon: FileText },
            { id: 'users', label: 'Người dùng', icon: Users, adminOnly: true },
            { id: 'settings', label: 'Cài đặt', icon: Settings },
          ].filter(tab => !tab.adminOnly || user.role === 'admin').map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setShowForm(false); setEditingId(null); }}
              className={cn(
                "flex items-center gap-2 px-6 py-3 text-[10px] uppercase tracking-widest font-bold transition-all border",
                activeTab === tab.id 
                  ? "bg-luxe-black text-white border-luxe-black" 
                  : "bg-white text-luxe-text border-luxe-champagne/20 hover:border-luxe-gold"
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Consultations Tab */}
        {activeTab === 'consultations' && (
          <div className="bg-white border border-luxe-champagne/10 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-luxe-champagne/10 bg-luxe-cream flex justify-between items-center">
              <h3 className="font-serif text-xl">Danh sách yêu cầu tư vấn</h3>
              <span className="text-[10px] uppercase tracking-widest font-bold text-luxe-gold bg-luxe-gold/10 px-3 py-1">
                {consultations.length} yêu cầu
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-luxe-text/60 border-b border-luxe-champagne/10">
                    <th className="px-6 py-4 font-bold">Ngày gửi</th>
                    <th className="px-6 py-4 font-bold">Số điện thoại</th>
                    <th className="px-6 py-4 font-bold">Trạng thái</th>
                    <th className="px-6 py-4 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxe-champagne/10">
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

                  try {
                    if (editingId) {
                      await updateDoc(doc(db, 'users', editingId), { displayName, role });
                    } else {
                      // Note: Creating a user in Firebase Auth from client is tricky.
                      // We just save the profile to Firestore.
                      await setDoc(doc(db, 'users', email.replace(/[@.]/g, '_')), {
                        email,
                        displayName,
                        role,
                        createdAt: serverTimestamp()
                      });
                      alert('Đã tạo hồ sơ người dùng. Người dùng này cần đăng ký tài khoản với email này để truy cập.');
                    }
                    setShowForm(false);
                    setEditingId(null);
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

export default AdminPage;
