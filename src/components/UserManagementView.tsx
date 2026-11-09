import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  User as UserIcon, 
  Search, 
  X, 
  CheckCircle2, 
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { User } from '../types/user';
import { getUsers, addUser, updateUser, deleteUser } from '../data/authService';

interface UserManagementViewProps {
  currentUser: User;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);

  // Form states for Add User
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('123456');
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for Edit User
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'user'>('user');
  const [editPassword, setEditPassword] = useState('');

  const loadUserList = () => {
    setUsers(getUsers());
  };

  useEffect(() => {
    loadUserList();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setNewUsername('');
    setNewName('');
    setNewPassword('123456');
    setNewRole('user');
    setFormError(null);
    setIsAddModalOpen(true);
  };

  // Submit Add User
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const u = newUsername.trim();
    const n = newName.trim();
    const p = newPassword.trim();

    if (!u) {
      setFormError('请输入用户名');
      return;
    }
    if (!n) {
      setFormError('请输入姓名');
      return;
    }
    if (!p) {
      setFormError('请输入密码');
      return;
    }

    const res = addUser({
      username: u,
      name: n,
      password: p,
      role: newRole,
      creator: currentUser.username
    });

    if (!res.success) {
      setFormError(res.message || '新增用户失败');
      return;
    }

    setIsAddModalOpen(false);
    loadUserList();
    showToast(`成功新增用户 “${u}”`);
  };

  // Open Edit Modal
  const handleOpenEditModal = (target: User) => {
    setEditingUser(target);
    setEditName(target.name);
    setEditRole(target.role);
    setEditPassword('');
    setFormError(null);
  };

  // Submit Edit User
  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setFormError(null);

    const n = editName.trim();
    if (!n) {
      setFormError('请输入姓名');
      return;
    }

    const updatedPayload: User = {
      ...editingUser,
      name: n,
      role: editingUser.username === 'admin' ? 'admin' : editRole, // Protect admin
      ...(editPassword.trim() ? { password: editPassword.trim() } : {})
    };

    const res = updateUser(updatedPayload);
    if (!res.success) {
      setFormError(res.message || '修改用户信息失败');
      return;
    }

    setEditingUser(null);
    loadUserList();
    showToast(`成功更新用户 “${editingUser.username}” 的信息`);
  };

  // Submit Delete User
  const handleDeleteUserConfirm = () => {
    if (!deleteConfirmUser) return;
    const res = deleteUser(deleteConfirmUser.id);
    if (!res.success) {
      alert(res.message);
      return;
    }
    setDeleteConfirmUser(null);
    loadUserList();
    showToast(`用户 “${deleteConfirmUser.username}” 已删除`);
  };

  // Filtered users
  const filteredUsers = users.filter(u => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      u.creator.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0e3b66] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white border border-[#a4c3de]/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0e3b66] text-white flex items-center justify-center shadow-xs">
            <Users className="w-5 h-5 text-sky-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-[#102a48] tracking-tight">
                系统用户管理
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-sky-100 text-[#0e3b66] text-[11px] font-bold">
                共 {users.length} 名用户
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              支持平台用户账户的新增、信息修改与权限管理（仅系统管理员可见）
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索用户名/姓名..."
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-[#bcd7ee] rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0e3b66]/20 focus:border-[#0e3b66] w-48 sm:w-56"
            />
          </div>

          {/* Add User Button */}
          <button
            id="add-user-btn"
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0e3b66] hover:bg-[#124575] active:bg-[#092b4d] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>新增用户</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#a4c3de]/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#f0f6fc] text-[#102a48] font-bold border-b border-[#bcd7ee]">
              <tr>
                <th className="py-3 px-4 font-bold text-[#102a48]">用户名</th>
                <th className="py-3 px-4 font-bold text-[#102a48]">姓名/昵称</th>
                <th className="py-3 px-4 font-bold text-[#102a48]">系统角色</th>
                <th className="py-3 px-4 font-bold text-[#102a48]">创建人</th>
                <th className="py-3 px-4 font-bold text-[#102a48]">创建时间</th>
                <th className="py-3 px-4 font-bold text-[#102a48] text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    未检索到符合条件的用户
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isAdmin = u.role === 'admin';
                  const isCurrent = u.id === currentUser.id;
                  const isBuiltinAdmin = u.username === 'admin';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* 用户名 */}
                      <td className="py-3 px-4 font-mono font-bold text-[#0e3b66] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{u.username}</span>
                          {isBuiltinAdmin && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-sky-100 text-[#0e3b66] font-sans font-semibold">
                              系统内置
                            </span>
                          )}
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-100 text-emerald-700 font-sans font-semibold">
                              当前账号
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 姓名 */}
                      <td className="py-3 px-4 text-slate-800 font-medium">
                        {u.name}
                      </td>

                      {/* 角色 */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0e3b66] border border-blue-200 text-[11px] font-bold">
                            <ShieldCheck className="w-3 h-3 text-[#0e3b66]" />
                            <span>超级管理员</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium">
                            <UserIcon className="w-3 h-3 text-slate-500" />
                            <span>普通用户</span>
                          </span>
                        )}
                      </td>

                      {/* 创建人 */}
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                        {u.creator || '-'}
                      </td>

                      {/* 创建时间 */}
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {u.createdAt}
                      </td>

                      {/* 操作 */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-[#0e3b66] hover:bg-[#f0f6fc] text-slate-700 hover:text-[#0e3b66] transition-all cursor-pointer"
                            title="修改用户信息与密码"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {isBuiltinAdmin ? (
                            <button
                              disabled
                              className="p-1.5 rounded-lg border border-slate-100 text-slate-300 cursor-not-allowed"
                              title="内置系统管理员不可删除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmUser(u)}
                              className="p-1.5 rounded-lg border border-rose-200 hover:border-rose-400 hover:bg-rose-50 text-rose-600 transition-all cursor-pointer"
                              title="删除此用户"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: 新增用户 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0e3b66] text-white flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-sky-200" />
                </div>
                <h3 className="text-sm font-bold text-[#102a48]">新增系统用户</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#102a48] mb-1">
                  用户名 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="请输入登录用户名 (英文字母/数字)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0e3b66]/20 focus:border-[#0e3b66]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102a48] mb-1">
                  姓名 / 昵称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="如：张三 助理病理研究员"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0e3b66]/20 focus:border-[#0e3b66]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102a48] mb-1">
                  初始密码 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="默认 123456"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0e3b66]/20 focus:border-[#0e3b66]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102a48] mb-1">
                  用户角色
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewRole('user')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                      newRole === 'user'
                        ? 'bg-[#0e3b66] text-white border-[#0e3b66]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>普通用户</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewRole('admin')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                      newRole === 'admin'
                        ? 'bg-[#0e3b66] text-white border-[#0e3b66]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>管理员</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0e3b66] hover:bg-[#124575] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  立即新增
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: 修改用户 */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0e3b66] text-white flex items-center justify-center">
                  <Edit3 className="w-4 h-4 text-sky-200" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#102a48]">修改用户信息</h3>
                  <p className="text-[11px] text-slate-500">账户用户名：{editingUser.username}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#102a48] mb-1">
                  姓名 / 昵称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0e3b66]/20 focus:border-[#0e3b66]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102a48] mb-1">
                  重置密码 (留空则不修改)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="若无需重置，请留空"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0e3b66]/20 focus:border-[#0e3b66]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102a48] mb-1">
                  系统角色
                </label>
                {editingUser.username === 'admin' ? (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0e3b66]" />
                    <span>系统内置主管理员角色不可降级</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditRole('user')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                        editRole === 'user'
                          ? 'bg-[#0e3b66] text-white border-[#0e3b66]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>普通用户</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditRole('admin')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                        editRole === 'admin'
                          ? 'bg-[#0e3b66] text-white border-[#0e3b66]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>管理员</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0e3b66] hover:bg-[#124575] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: 删除确认 */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">确认删除用户？</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  用户名：<strong className="text-slate-800">{deleteConfirmUser.username}</strong>
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              删除后该用户将无法再登录平台，此操作无法恢复，请谨慎确认。
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleDeleteUserConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
