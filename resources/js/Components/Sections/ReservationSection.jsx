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
                setTimeout(() => setShowSuccess(false), 8000);
            },
        });
    };

    return (
        <section id="reservation" className="inverted section">
            <div className="shell-narrow">
                <div className="mb-12 text-center">
                    <div className="t-label text-muted-inverse mb-4">Бронирование</div>
                    <h2 className="t-h2">Забронировать стол</h2>
                </div>
                {showSuccess ? (
                    <div className="border border-hair-inverse p-12 text-center">
                        <div className="t-label text-muted-inverse mb-3">Получили</div>
                        <p className="t-h3 mb-4" style={{ fontWeight: 400 }}>
                            Заявка отправлена.
                        </p>
                        <p className="t-small text-muted-inverse">
                            Мы перезвоним в течение 30 минут.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={submit} className="grid gap-6 md:grid-cols-2">
                        <label className="md:col-span-2 block">
                            <span className="t-label block mb-2">Имя</span>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Как вас зовут"
                                required
                                className="field"
                            />
                            {errors.name && <div className="t-small mt-2" style={{ opacity: 0.8 }}>{errors.name}</div>}
                        </label>
                        <label className="block">
                            <span className="t-label block mb-2">Телефон</span>
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="+7 (___) ___-__-__"
                                required
                                className="field"
                            />
                            {errors.phone && <div className="t-small mt-2" style={{ opacity: 0.8 }}>{errors.phone}</div>}
                        </label>
                        <label className="block">
                            <span className="t-label block mb-2">Гостей</span>
                            <input
                                type="number"
                                value={data.guests}
                                onChange={(e) => setData('guests', parseInt(e.target.value, 10))}
                                min={1}
                                max={50}
                                required
                                className="field"
                            />
                            {errors.guests && <div className="t-small mt-2" style={{ opacity: 0.8 }}>{errors.guests}</div>}
                        </label>
                        <label className="block">
                            <span className="t-label block mb-2">Дата</span>
                            <input
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                required
                                className="field"
                            />
                            {errors.date && <div className="t-small mt-2" style={{ opacity: 0.8 }}>{errors.date}</div>}
                        </label>
                        <label className="block">
                            <span className="t-label block mb-2">Время</span>
                            <input
                                type="time"
                                value={data.time}
                                onChange={(e) => setData('time', e.target.value)}
                                className="field"
                            />
                        </label>
                        <label className="md:col-span-2 block">
                            <span className="t-label block mb-2">Комментарий</span>
                            <textarea
                                value={data.comment}
                                onChange={(e) => setData('comment', e.target.value)}
                                placeholder="По желанию"
                                rows={2}
                                className="field"
                                style={{ resize: 'vertical' }}
                            />
                        </label>
                        <div className="md:col-span-2 pt-6 text-center">
                            <button
                                type="submit"
                                disabled={processing}
                                className="cta disabled:opacity-50"
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
