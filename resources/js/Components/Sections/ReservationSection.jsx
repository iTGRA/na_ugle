import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function ReservationSection() {
    const { flash = {} } = usePage().props;
    const [showSuccess, setShowSuccess] = useState(Boolean(flash?.reservation_success));

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone: '',
        date: '',
        time: '',
        guests: 2,
        comment: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/reservation', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 7000);
            },
        });
    };

    return (
        <section id="reservation" className="py-24 px-6" style={{ background: 'var(--ember)' }}>
            <div className="max-w-3xl mx-auto">
                <h2 className="font-hand text-white text-center mb-2" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
                    Забронировать стол
                </h2>
                <p className="text-center text-white/90 mb-10 font-hand text-xl">
                    Дурняша ждёт — оставьте имя и телефон, мы перезвоним
                </p>
                {showSuccess ? (
                    <div className="bg-charcoal text-cream p-8 text-center">
                        <div className="font-hand text-4xl text-amber mb-3">Получили!</div>
                        <p>Заявка отправлена. Мы перезвоним в течение 30 минут.</p>
                    </div>
                ) : (
                    <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Как вас зовут"
                                required
                                className="w-full px-5 py-4 bg-charcoal text-cream placeholder-ash border border-charcoal focus:outline-none focus:border-amber transition-colors"
                            />
                            {errors.name && <div className="text-white/90 text-sm mt-1">{errors.name}</div>}
                        </div>
                        <div>
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="Телефон"
                                required
                                className="w-full px-5 py-4 bg-charcoal text-cream placeholder-ash border border-charcoal focus:outline-none focus:border-amber transition-colors"
                            />
                            {errors.phone && <div className="text-white/90 text-sm mt-1">{errors.phone}</div>}
                        </div>
                        <div>
                            <input
                                type="number"
                                value={data.guests}
                                onChange={(e) => setData('guests', parseInt(e.target.value, 10))}
                                placeholder="Гостей"
                                min={1}
                                max={50}
                                required
                                className="w-full px-5 py-4 bg-charcoal text-cream placeholder-ash border border-charcoal focus:outline-none focus:border-amber transition-colors"
                            />
                            {errors.guests && <div className="text-white/90 text-sm mt-1">{errors.guests}</div>}
                        </div>
                        <div>
                            <input
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                required
                                className="w-full px-5 py-4 bg-charcoal text-cream border border-charcoal focus:outline-none focus:border-amber transition-colors"
                            />
                            {errors.date && <div className="text-white/90 text-sm mt-1">{errors.date}</div>}
                        </div>
                        <div>
                            <input
                                type="time"
                                value={data.time}
                                onChange={(e) => setData('time', e.target.value)}
                                className="w-full px-5 py-4 bg-charcoal text-cream border border-charcoal focus:outline-none focus:border-amber transition-colors"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <textarea
                                value={data.comment}
                                onChange={(e) => setData('comment', e.target.value)}
                                placeholder="Комментарий (необязательно)"
                                rows={3}
                                className="w-full px-5 py-4 bg-charcoal text-cream placeholder-ash border border-charcoal focus:outline-none focus:border-amber transition-colors"
                            />
                        </div>
                        <div className="md:col-span-2 text-center">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-block px-10 py-4 bg-charcoal text-ember font-bold uppercase tracking-widest hover:bg-amber hover:text-charcoal transition-colors disabled:opacity-60"
                            >
                                {processing ? 'Отправляем…' : 'Отправить заявку'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}
