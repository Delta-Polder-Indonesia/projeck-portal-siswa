import { useMemo, useState } from 'react';
import { CreditCard, Landmark, Wallet, CircleDollarSign } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useAuth } from '../../context/AuthContext';
import {
  bayarTagihanSekolah,
  getTagihanSekolahBySiswa,
  getTahunTagihanSiswa,
} from '../../data/store';
import type { TagihanSekolah } from '../../types';
import { useStoreVersion } from '../../hooks/useStoreVersion';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const PAYMENT_METHODS: Array<{
  value: NonNullable<TagihanSekolah['paymentMethod']>;
  label: string;
}> = [
  { value: 'atm', label: 'ATM Transfer' },
  { value: 'mobile_banking', label: 'Mobile Banking' },
  { value: 'internet_banking', label: 'Internet Banking' },
  { value: 'ewallet', label: 'E-Wallet' },
  { value: 'tunai', label: 'Tunai di Tata Usaha' },
];

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTanggalWaktu(timestamp?: number) {
  if (!timestamp) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(timestamp);
}

function getPaymentMethodLabel(method?: TagihanSekolah['paymentMethod']) {
  if (!method) return '-';
  return PAYMENT_METHODS.find(item => item.value === method)?.label || method;
}

export default function TagihanSekolahPage() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  
  const [selectedBillIds, setSelectedBillIds] = useState<string[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<NonNullable<TagihanSekolah['paymentMethod']>>('atm');
  const [infoMessage, setInfoMessage] = useState<string>('');

  const availableYears = useMemo(() => {
    if (!user) return [];
    return getTahunTagihanSiswa(user.id);
  }, [user, storeVersion]);

  const activeYear = selectedYear ?? availableYears[0] ?? new Date().getFullYear();

  const bills = useMemo(() => {
    if (!user) return [];
    return getTagihanSekolahBySiswa(user.id, activeYear);
  }, [user, activeYear, storeVersion]);

  const ringkasan = useMemo(() => {
    const lunas = bills.filter(item => item.status === 'lunas');
    const belumLunas = bills.filter(item => item.status === 'belum_lunas');
    return {
      totalTagihan: bills.reduce((sum, item) => sum + item.amount, 0),
      totalLunas: lunas.reduce((sum, item) => sum + item.amount, 0),
      totalBelumLunas: belumLunas.reduce((sum, item) => sum + item.amount, 0),
      jumlahLunas: lunas.length,
      jumlahBelumLunas: belumLunas.length,
    };
  }, [bills]);

  const billsToPay = useMemo(() => {
    return bills.filter(item => selectedBillIds.includes(item.id) && item.status === 'belum_lunas');
  }, [bills, selectedBillIds]);

  const totalSelectedAmount = useMemo(() => {
    return billsToPay.reduce((sum, item) => sum + item.amount, 0);
  }, [billsToPay]);

  const handleToggleSelectBill = (id: string) => {
    setInfoMessage('');
    setSelectedBillIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBayarMulti = () => {
    if (billsToPay.length === 0) return;
    
    billsToPay.forEach(bill => {
      bayarTagihanSekolah(bill.id, selectedMethod);
    });

    const listBulan = billsToPay.map(b => MONTH_NAMES[b.month - 1]).join(', ');
    setInfoMessage(`Pembayaran untuk periode [ ${listBulan} ] tahun ${activeYear} berhasil diproses.`);
    setSelectedBillIds([]);
  };

  const handleUnduhBuktiPdf = (bill: TagihanSekolah) => {
    const paymentLabel = getPaymentMethodLabel(bill.paymentMethod);
    const nomorTransaksi = `TRX-${bill.year}${String(bill.month).padStart(2, '0')}-${bill.studentId.toUpperCase()}`;
    const tanggalCetak = new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(Date.now());

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const marginX = 52;
    let cursorY = 66;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Bukti Pembayaran Uang Sekolah', marginX, cursorY);

    cursorY += 22;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(75, 85, 99);
    doc.text('Dokumen pembayaran resmi siswa', marginX, cursorY);

    cursorY += 16;
    doc.setDrawColor(203, 213, 225);
    doc.line(marginX, cursorY, 545, cursorY);

    cursorY += 28;
    doc.setTextColor(17, 24, 39);
    const detailRows: Array<[string, string]> = [
      ['Nomor Transaksi', nomorTransaksi],
      ['Tanggal Cetak', tanggalCetak],
      ['Nama Siswa', user?.name || '-'],
      ['ID Siswa', bill.studentId],
      ['Periode', `${MONTH_NAMES[bill.month - 1]} ${bill.year}`],
      ['Metode Pembayaran', paymentLabel],
      ['Waktu Pembayaran', formatTanggalWaktu(bill.paidAt)],
      ['Status', 'Lunas'],
    ];

    detailRows.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(`${label}:`, marginX, cursorY);

      doc.setFont('helvetica', 'normal');
      const wrappedValue = doc.splitTextToSize(value, 350);
      doc.text(wrappedValue, marginX + 140, cursorY);
      cursorY += Math.max(18, wrappedValue.length * 14);
    });

    cursorY += 12;
    doc.setDrawColor(203, 213, 225);
    doc.rect(marginX, cursorY, 493, 72);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('Total Pembayaran', marginX + 14, cursorY + 24);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text(formatRupiah(bill.amount), marginX + 14, cursorY + 54);

    cursorY += 98;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text('Dokumen ini dibuat otomatis oleh sistem absensi dan administrasi sekolah.', marginX, cursorY);

    const namaBulan = MONTH_NAMES[bill.month - 1].toLowerCase();
    const namaFile = `bukti-pembayaran-${namaBulan}-${bill.year}.pdf`;
    doc.save(namaFile);
  };

  const handleUnduhDaftarTahunanPdf = () => {
    if (!user) return;

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const marginX = 48;
    let cursorY = 60;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`Daftar Pembayaran Tahun ${activeYear}`, marginX, cursorY);

    cursorY += 20;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Nama Siswa: ${user.name}`, marginX, cursorY);
    cursorY += 16;
    doc.text(`ID Siswa: ${user.id}`, marginX, cursorY);

    cursorY += 16;
    const tanggalCetak = new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(Date.now());
    doc.text(`Tanggal Cetak: ${tanggalCetak}`, marginX, cursorY);

    cursorY += 18;
    doc.setDrawColor(203, 213, 225);
    doc.line(marginX, cursorY, 547, cursorY);

    cursorY += 22;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Bulan', marginX, cursorY);
    doc.text('Status', marginX + 120, cursorY);
    doc.text('Nominal', marginX + 210, cursorY);
    doc.text('Metode', marginX + 320, cursorY);
    doc.text('Waktu Bayar', marginX + 430, cursorY);

    cursorY += 10;
    doc.setLineWidth(0.6);
    doc.line(marginX, cursorY, 547, cursorY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    bills.forEach((bill) => {
      if (cursorY > 760) {
        doc.addPage();
        cursorY = 60;
      }

      cursorY += 18;
      doc.text(MONTH_NAMES[bill.month - 1], marginX, cursorY);
      doc.text(bill.status === 'lunas' ? 'Lunas' : 'Belum Lunas', marginX + 120, cursorY);
      doc.text(formatRupiah(bill.amount), marginX + 210, cursorY);
      doc.text(getPaymentMethodLabel(bill.paymentMethod), marginX + 320, cursorY);
      doc.text(formatTanggalWaktu(bill.paidAt), marginX + 430, cursorY);

      cursorY += 6;
      doc.setDrawColor(229, 231, 235);
      doc.line(marginX, cursorY, 547, cursorY);
    });

    cursorY += 24;
    doc.setFont('helvetica', 'bold');
    doc.text(`Ringkasan: ${ringkasan.jumlahLunas} bulan lunas, ${ringkasan.jumlahBelumLunas} bulan belum lunas`, marginX, cursorY);

    const namaFile = `daftar-pembayaran-${activeYear}-${user.id}.pdf`;
    doc.save(namaFile);
  };

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto p-2 antialiased text-slate-600 bg-white selection:bg-slate-200">
      
      {/* HEADER HALAMAN & RINGKASAN */}
      <section className="space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-1.5">
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">Tagihan Kewajiban Sekolah</h1>
            <p className="text-[11px] text-slate-400 mt-1 leading-none font-medium">Daftar rekonsiliasi kas administrasi siswa berdasarkan periode aktif.</p>
          </div>
          <div className="flex items-center gap-1.5 self-start sm:self-auto leading-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tahun Buku:</span>
            <select
              value={activeYear}
              onChange={(event) => {
                setSelectedYear(Number(event.target.value));
                setSelectedBillIds([]); 
                setInfoMessage('');
              }}
              className="border border-slate-200 rounded-sm px-2 py-0.5 text-xs font-semibold bg-white text-slate-700 cursor-pointer focus:outline-hidden hover:border-slate-300"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid Informasi Keuangan Pendek */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="border border-slate-100 rounded-sm p-2 bg-slate-50/40 space-y-0.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">Total Tagihan Tahunan</p>
            <p className="text-xs font-bold text-slate-900 leading-none">{formatRupiah(ringkasan.totalTagihan)}</p>
          </div>
          <div className="border border-slate-100 rounded-sm p-2 bg-slate-50/10 space-y-0.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">Kliring Terbayar</p>
            <p className="text-xs font-bold text-slate-800 leading-none">{ringkasan.jumlahLunas} Bulan</p>
          </div>
          <div className="border border-slate-100 rounded-sm p-2 bg-slate-50/10 space-y-0.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">Tunggakan Administrasi</p>
            <p className="text-xs font-bold text-slate-800 leading-none">{ringkasan.jumlahBelumLunas} Bulan</p>
          </div>
        </div>
      </section>

      {/* STRUKTUR TABEL UTAMA */}
      <section className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-0.5">
          <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Rincian Laporan Bulanan ({activeYear})</h2>
          <button
            type="button"
            onClick={handleUnduhDaftarTahunanPdf}
            className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 px-2 py-0.5 rounded-sm cursor-pointer self-start sm:self-auto leading-none"
          >
            Unduh Laporan Tahunan (.PDF)
          </button>
        </div>
        
        <div className="border border-slate-100 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase tracking-wider border-b border-slate-100">
                  <th className="px-3 py-1.5">Bulan Periode</th>
                  <th className="px-3 py-1.5 w-32 shrink-0">Nominal</th>
                  <th className="px-3 py-1.5 w-28 shrink-0">Jatuh Tempo</th>
                  <th className="px-3 py-1.5 w-28 shrink-0">Status Kelayakan</th>
                  <th className="px-3 py-1.5 w-36 shrink-0">Kanal Kliring</th>
                  <th className="px-3 py-1.5 w-24 shrink-0 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                {bills.map(item => {
                  const isSelected = selectedBillIds.includes(item.id);
                  return (
                    <tr 
                      key={item.id} 
                      className={`leading-tight ${
                        isSelected ? 'bg-slate-50/70 font-semibold' : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <td className="px-3 py-1.5 font-bold text-slate-900">{MONTH_NAMES[item.month - 1]}</td>
                      <td className="px-3 py-1.5 font-mono text-slate-900 font-medium">{formatRupiah(item.amount)}</td>
                      <td className="px-3 py-1.5 text-slate-400 text-[11px] font-mono">{item.dueDate}</td>
                      <td className="px-3 py-1.5 text-[11px]">
                        <div className="flex items-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'lunas' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className={item.status === 'lunas' ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                            {item.status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-1.5 text-slate-500 text-[11px] font-medium">{getPaymentMethodLabel(item.paymentMethod)}</td>
                      <td className="px-3 py-1.5 text-right">
                        {item.status === 'belum_lunas' ? (
                          <button
                            type="button"
                            onClick={() => handleToggleSelectBill(item.id)}
                            className={`w-[76px] py-0.5 rounded-sm text-[10px] font-bold tracking-tight text-center inline-block cursor-pointer border ${
                              isSelected
                                ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600'
                                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {isSelected ? '✓ Terpilih' : 'Pilih Bulan'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleUnduhBuktiPdf(item)}
                            className="w-[76px] py-0.5 rounded-sm border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-800 text-center inline-block cursor-pointer text-[10px] font-bold"
                          >
                            Unduh Resi
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* METODE PEMBAYARAN HUB */}
      <section className="border border-slate-100 rounded-sm p-3 space-y-3">
        <div className="leading-none">
          <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Kanal Gerbang Pembayaran</h2>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Pilih salah satu instrumen keuangan pembayaran sah di bawah ini.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
          {PAYMENT_METHODS.map(method => {
            const isTarget = selectedMethod === method.value;
            return (
              <button
                key={method.value}
                type="button"
                onClick={() => setSelectedMethod(method.value)}
                className={`rounded-sm border p-2 text-left cursor-pointer ${
                  isTarget
                    ? 'border-slate-900 bg-slate-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex flex-col gap-1 text-slate-700 leading-tight">
                  <div className="text-slate-900">
                    {method.value === 'atm' && <Landmark className="w-3.5 h-3.5" />}
                    {method.value === 'mobile_banking' && <CreditCard className="w-3.5 h-3.5" />}
                    {method.value === 'internet_banking' && <CreditCard className="w-3.5 h-3.5" />}
                    {method.value === 'ewallet' && <Wallet className="w-3.5 h-3.5" />}
                    {method.value === 'tunai' && <CircleDollarSign className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs font-bold tracking-tight text-slate-800">{method.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* CHECKOUT SUBMISSION AREA */}
        <div className="border-t border-slate-100 pt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 leading-none">
          <div className="text-xs">
            {billsToPay.length > 0 ? (
              <p className="text-slate-500 font-medium">
                Mekanisme pembayaran: <span className="text-slate-900 font-bold">{billsToPay.length} Bulan</span> terpilih dengan akumulasi tagihan:{' '}
                <span className="text-slate-900 font-mono font-bold text-[11px] bg-slate-50 px-1 py-0.5 rounded-sm border border-slate-200 ml-1 inline-block">
                  {formatRupiah(totalSelectedAmount)}
                </span>
              </p>
            ) : (
              <p className="text-slate-400 italic text-[11px] font-medium">Pilih satu atau beberapa bulan pada tabel rincian di atas untuk memuat otorisasi kas.</p>
            )}
          </div>
          
          <button
            type="button"
            onClick={handleBayarMulti}
            disabled={billsToPay.length === 0}
            className="px-3 py-1.5 rounded-sm bg-slate-900 text-white text-xs font-bold disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-black cursor-pointer self-start md:self-auto"
          >
            Eksekusi Transaksi ({billsToPay.length})
          </button>
        </div>

        {infoMessage && (
          <div className="text-xs font-semibold text-slate-700 p-2 border border-slate-200 bg-slate-50/50 rounded-sm leading-normal">
            {infoMessage}
          </div>
        )}
      </section>
      
    </div>
  );
}