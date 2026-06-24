import { useMemo, useRef, useState } from 'react';
import { CheckCircle2, Download, Mail, XCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  approvePPDBApplication,
  getClasses,
  getPPDBApplications,
  rejectPPDBApplication,
} from '../../data/store';
import { useStoreVersion } from '../../hooks/useStoreVersion';

type InboxPPDBAdminProps = {
  setNotice: (msg: string) => void;
};

function formatDate(iso: string) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function InboxPPDBAdmin({ setNotice }: InboxPPDBAdminProps) {
  const storeVersion = useStoreVersion();
  const applications = useMemo(() => getPPDBApplications(), [storeVersion]);
  const classes = useMemo(() => getClasses(), [storeVersion]);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(applications[0]?.id ?? '');
  const [classTargets, setClassTargets] = useState<Record<string, string>>({});
  const detailRef = useRef<HTMLDivElement>(null);

  const filtered = applications.filter((item) => {
    const key = query.trim().toLowerCase();
    if (!key) return true;
    return (
      item.namaLengkap.toLowerCase().includes(key) ||
      item.registrationNo.toLowerCase().includes(key) ||
      item.email.toLowerCase().includes(key)
    );
  });

  const selected = filtered.find((item) => item.id === selectedId) || filtered[0] || null;

  const handleApprove = (applicationId: string) => {
    const classId = classTargets[applicationId] || classes[0]?.id;
    if (!classId) {
      setNotice('Belum ada kelas tujuan.');
      return;
    }
    const result = approvePPDBApplication(applicationId, classId);
    setNotice(result.message);
  };

  const handleReject = (applicationId: string) => {
    const confirmed = window.confirm('Yakin menolak pendaftar ini?');
    if (!confirmed) return;
    const result = rejectPPDBApplication(applicationId);
    setNotice(result.message);
  };

  const handleExportPdf = async () => {
    if (!selected || !detailRef.current) return;
    const canvas = await html2canvas(detailRef.current, { scale: 2, backgroundColor: '#ffffff' });
    const imageData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;
    const x = (pageWidth - imgWidth) / 2;
    pdf.addImage(imageData, 'PNG', x, 10, imgWidth, imgHeight);
    pdf.save(`riwayat-${selected.namaLengkap.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };

  return (
    <section className="grid h-full min-h-[520px] gap-3 lg:grid-cols-[320px_1fr]">
      <aside className="rounded border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-3">
          <h4 className="text-sm font-bold text-gray-800">Inbox PPDB</h4>
          <p className="mt-1 text-[11px] text-gray-500">Pendaftar baru masuk sebagai pesan inbox admin.</p>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama/email/no registrasi"
            className="mt-2 w-full rounded border border-gray-300 px-2 py-1.5 text-xs"
          />
        </div>

        <div className="max-h-[560px] overflow-y-auto">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`w-full border-b border-gray-100 px-3 py-2 text-left transition ${
                selected?.id === item.id ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs font-semibold text-gray-800">{item.namaLengkap}</p>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                    item.status === 'pending'
                      ? 'bg-amber-100 text-amber-700'
                      : item.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-500">
                <Mail className="h-3 w-3" /> {item.email || '-'}
              </p>
              <p className="mt-1 text-[10px] text-gray-400">{item.registrationNo}</p>
            </button>
          ))}

          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center text-[10px] uppercase tracking-widest text-gray-400">
              tidak ada data inbox
            </p>
          ) : null}
        </div>
      </aside>

      <main className="rounded border border-gray-200 bg-white p-3">
        {selected ? (
          <>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
              <div>
                <h4 className="text-sm font-bold text-gray-800">Detail Riwayat Pendaftar</h4>
                <p className="text-[11px] text-gray-500">Klik simpan PDF untuk mencetak arsip biodata.</p>
              </div>
              <button
                type="button"
                onClick={handleExportPdf}
                className="inline-flex items-center gap-1 rounded border border-blue-200 px-2.5 py-1.5 text-[11px] font-bold text-blue-700 hover:bg-blue-50"
              >
                <Download className="h-3.5 w-3.5" /> Simpan PDF
              </button>
            </div>

            <div ref={detailRef} className="rounded border border-gray-300 bg-white p-4">
              <div className="mb-4 border-b border-gray-200 pb-3 text-center">
                <p className="text-[11px] uppercase tracking-widest text-gray-500">Berkas Pendaftaran PPDB</p>
                <h3 className="text-lg font-bold text-gray-900">Riwayat Calon Siswa</h3>
                <p className="text-[11px] text-gray-500">No Registrasi: {selected.registrationNo}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-[130px_1fr]">
                <div className="overflow-hidden rounded border border-gray-300 bg-gray-100">
                  {selected.pasFotoDataUrl ? (
                    <img src={selected.pasFotoDataUrl} alt={selected.namaLengkap} className="h-40 w-full object-cover" />
                  ) : (
                    <div className="flex h-40 items-center justify-center text-[11px] text-gray-400">Foto belum ada</div>
                  )}
                </div>
                <div className="grid gap-1 text-xs">
                  <p><span className="font-semibold">Nama:</span> {selected.namaLengkap}</p>
                  <p><span className="font-semibold">NIK / NISN:</span> {selected.nik} / {selected.nisn || '-'}</p>
                  <p><span className="font-semibold">Tempat, Tanggal Lahir:</span> {selected.tempatLahir}, {selected.tanggalLahir}</p>
                  <p><span className="font-semibold">Jenis Kelamin:</span> {selected.jenisKelamin}</p>
                  <p><span className="font-semibold">Asal Sekolah:</span> {selected.sekolahAsal}</p>
                  <p><span className="font-semibold">Alamat:</span> {selected.alamatLengkap}, {selected.desaKelurahan}, {selected.kecamatan}, {selected.kabupatenKota}</p>
                  <p><span className="font-semibold">Kontak:</span> {selected.nomorHp} / {selected.email}</p>
                  <p><span className="font-semibold">Orang Tua:</span> Ayah {selected.namaAyah}, Ibu {selected.namaIbu}</p>
                  <p><span className="font-semibold">Jalur:</span> {selected.jalurPendaftaran}</p>
                  <p><span className="font-semibold">Waktu Daftar:</span> {formatDate(selected.submittedAt)}</p>
                </div>
              </div>

              {selected.dokumen.length > 0 ? (
                <div className="mt-4 border-t border-gray-200 pt-3 text-xs">
                  <p className="mb-1 font-semibold text-gray-700">Dokumen terlampir</p>
                  <ul className="list-disc space-y-0.5 pl-4 text-gray-600">
                    {selected.dokumen.map((doc) => (
                      <li key={doc}>{doc}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-3">
              {selected.status === 'pending' ? (
                <>
                  <select
                    value={classTargets[selected.id] || classes[0]?.id || ''}
                    onChange={(event) =>
                      setClassTargets((prev) => ({
                        ...prev,
                        [selected.id]: event.target.value,
                      }))
                    }
                    className="rounded border border-gray-300 px-2 py-1.5 text-xs"
                  >
                    {classes.map((classItem) => (
                      <option key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleApprove(selected.id)}
                    className="inline-flex items-center gap-1 rounded border border-emerald-200 px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Terima
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(selected.id)}
                    className="inline-flex items-center gap-1 rounded border border-rose-200 px-2.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Tolak
                  </button>
                </>
              ) : (
                <p className="text-xs text-gray-500">Berkas sudah diproses pada {selected.processedAt ? formatDate(selected.processedAt) : '-'}</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            Pilih pesan pendaftar untuk melihat detail.
          </div>
        )}
      </main>
    </section>
  );
}
