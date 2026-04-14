<?php

namespace Database\Seeders;

use App\Models\MenuCategory;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuItemsSeeder extends Seeder
{
    /**
     * Stock photo pool (Unsplash) per category.
     * Items inside a category rotate through the pool.
     * Admin can swap any photo via /admin/menu/items/{id}/edit.
     */
    protected array $photos = [
        'na-hleb' => [
            'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1590080874884-a3a5f2d10007?w=1200&q=80&auto=format&fit=crop',
        ],
        'zakuski' => [
            'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?w=1200&q=80&auto=format&fit=crop',
        ],
        'salaty' => [
            'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80&auto=format&fit=crop',
        ],
        'supy' => [
            'https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1605709303005-d5f93c4a74b2?w=1200&q=80&auto=format&fit=crop',
        ],
        'goryachee' => [
            'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=1200&q=80&auto=format&fit=crop',
        ],
        'kolbasy' => [
            'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1558030006-450675393462?w=1200&q=80&auto=format&fit=crop',
        ],
        'garniry' => [
            'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1625944525533-473f1b3d9684?w=1200&q=80&auto=format&fit=crop',
        ],
        'sousy' => [
            'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=1200&q=80&auto=format&fit=crop',
        ],
        'deserty' => [
            'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1541976590-713941681591?w=1200&q=80&auto=format&fit=crop',
        ],
        'napitki' => [
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1523371054106-bbf80586c33c?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=1200&q=80&auto=format&fit=crop',
        ],
    ];

    protected array $items = [
        // На хлеб
        ['na-hleb', 'Фокачча / Мини-багет / Тартин', 'Свежий хлеб из печи — выбирайте по настроению.', 90, false, false, null],
        ['na-hleb', 'Паштет с грецкими орехами', 'Домашний куриный паштет, ломтики тартина, маринованный лук.', 420, true, false, null],
        ['na-hleb', 'Хумус из нута с редисом', 'Классический хумус, редис, оливковое масло, зира.', 390, false, false, null],
        ['na-hleb', 'Морковный хумус', 'Морковь-гриль, тахини, мёд, тмин — кремовая сладость.', 390, false, false, null],
        ['na-hleb', 'Бабагануш', 'Баклажаны с огня, тахини, гранат, кинза.', 290, false, false, null],
        ['na-hleb', 'Дзадзики', 'Греческий йогурт, огурец, чеснок, укроп.', 250, false, false, null],

        // Закуски
        ['zakuski', 'Крылья куриные 3 шт.', 'Острые или обычные — на гриле, с соусом на выбор.', 290, false, false, null],
        ['zakuski', 'Крылья куриные 6 шт.', 'Классика на двоих. Острые или обычные.', 550, true, false, null],
        ['zakuski', 'Крылья куриные 9 шт.', 'На компанию из трёх человек.', 830, false, false, null],
        ['zakuski', 'Крылья куриные 12 шт.', 'Большая подача для большой компании.', 1090, false, false, null],
        ['zakuski', 'Тартар из говядины с пармезаном', 'Свежая говядина, каперсы, дижонская горчица, пармезан, тосты.', 690, true, true, 'Нож, немного масла и выдержанный пармезан. Люблю за честность.'],
        ['zakuski', 'Гриль лангустины с салатом', 'Лангустины на углях, зелёный салат, лимон.', 820, true, false, null],
        ['zakuski', 'Авокадо гриль с копчёным айоли', 'Половинка авокадо с хоспера, копчёный айоли, семечки.', 720, false, false, null],
        ['zakuski', 'Свежая морковь и сельдерей с соусом тартар', 'Овощные палочки, прохладный соус тартар.', 390, false, false, null],
        ['zakuski', 'Овощные чипсы', 'Свекла, морковь, пастернак, морская соль.', 290, false, false, null],
        ['zakuski', 'Тёмные гренки с чесноком', 'Ржаной хлеб, чеснок, оливковое масло — к пиву.', 190, false, false, null],
        ['zakuski', 'Соленья', 'Капуста, опята, помидоры, корнишоны — микс от хозяйки.', 490, false, false, null],

        // Салаты
        ['salaty', 'Деревенский салат с маслом', 'Помидоры, огурцы, лук, зелень, оливковое масло, крупная соль.', 490, true, false, null],
        ['salaty', 'Деревенский салат со сметаной', 'Тот же деревенский, но на сметане. Вариант детства.', 610, false, false, null],
        ['salaty', 'Цезарь с лангустинами', 'Романо, пармезан, гренки, классический соус, лангустины.', 420, false, false, null],
        ['salaty', 'Цезарь с курицей', 'Курица с гриля, классика. Крупная порция.', 790, true, false, null],
        ['salaty', 'Стейк салат', 'Горячий стейк, зелень, томаты черри, пикантная заправка.', 0, false, true, 'Когда хочется стейк, но не хочется ничего гарнировать — берите этот.'],

        // Супы
        ['supy', 'Солянка', 'Мясная на говяжьем бульоне. Лимон, маслины, оливки.', 550, true, false, null],
        ['supy', 'Куриный бульон', 'Прозрачный бульон, домашняя лапша, зелень.', 250, false, false, null],
        ['supy', 'Говяжий бульон с рваным мясом', 'Плотный бульон, томлёная говядина, петрушка.', 590, false, true, 'Варим кости 12 часов. Самое честное, что мы готовим.'],
        ['supy', 'Грибной крем-суп', 'Шампиньоны, белые, сливки, трюфельное масло.', 390, false, false, null],

        // Горячее
        ['goryachee', 'Свиные рёбра с соусом BBQ', 'Томлёные 6 часов, потом на хоспер. Соус BBQ собственного приготовления.', 650, true, true, 'Маринад — неделя. Обжарка — минуты. Ешьте руками.'],
        ['goryachee', 'Стейк из капусты с трюфельным соусом', 'Капуста на углях, трюфельный соус, поджаренные орехи.', 490, false, false, null],
        ['goryachee', 'Морской окунь с чимичурри', 'Целиковый окунь на гриле, соус чимичурри, лимон.', 1250, true, false, null],
        ['goryachee', 'Свиная корейка', 'Толстый кусок корейки, горчичный маринад, запечённое яблоко.', 790, false, false, null],
        ['goryachee', 'Бифштекс', 'Рубленая говядина, яйцо, жареный лук.', 890, false, false, null],
        ['goryachee', 'Половинка цыплёнка', 'Цыплёнок под прессом, пикантный маринад.', 920, true, false, null],
        ['goryachee', 'Голень индейки с тремя видами соуса', 'Большая голень, соусы: BBQ, горчичный, острый айоли.', 1390, false, false, null],
        ['goryachee', 'Бургер из говядины', 'Котлета из рубленой говядины, чеддер, салат, бриошь.', 630, true, false, null],
        ['goryachee', 'Чикенбургер', 'Хрустящее куриное бедро, соус тартар, маринованный огурец.', 590, false, false, null],
        ['goryachee', 'Чак-ролл 100 гр', 'Стейк из отруба чак-ролл, сливочное масло с травами.', 590, false, false, null],
        ['goryachee', 'Рибай 100 гр', 'Премиум стейк. Прожарка medium-rare по умолчанию.', 1390, true, true, 'Сначала учишься готовить это без соли. Потом добавляешь только её.'],

        // Колбасы
        ['kolbasy', 'Колбаска индейка', 'Мягкая, постная, с травами. Делаем в своём цеху.', 290, true, false, null],
        ['kolbasy', 'Куриная с сыром', 'Мелко рубленая курица, плавленый сыр внутри.', 350, true, false, null],
        ['kolbasy', 'Свиная с чоризо', 'Острая, с паприкой и чесноком.', 490, false, false, null],
        ['kolbasy', 'Свиная с имбирём', 'Свежий имбирь, кардамон — непривычный, но затягивает.', 470, false, false, null],
        ['kolbasy', 'Баранья с кинзой', 'Баранина, много кинзы, зира, чёрный перец.', 690, true, true, 'Рецепт оттачивали полгода. Сейчас — то, что надо.'],

        // Гарниры
        ['garniry', 'Картофель пюре', 'Сливочное пюре с зелёным маслом.', 0, false, false, null],
        ['garniry', 'Овощные стейки', 'Баклажан, цукини, томаты на углях, оливковое масло.', 0, false, false, null],
        ['garniry', 'Печёная картошка с сыром', 'Молодая картошка, корочка с сыром, сметана.', 0, false, false, null],

        // Соусы
        ['sousy', 'Чимичурри', 'Петрушка, чеснок, орегано, оливковое масло, уксус.', 0, false, false, null],
        ['sousy', 'Сальса томатная', 'Свежие томаты, лук, кинза, острый перец.', 0, false, false, null],
        ['sousy', 'Тартар', 'Йогурт, огурец, каперсы, свежий укроп.', 0, false, false, null],
        ['sousy', 'Перечный соус', 'Классический сливочный с чёрным перцем.', 0, false, false, null],
        ['sousy', 'Блю-чиз', 'Плотный соус с голубым сыром.', 0, false, false, null],
        ['sousy', 'Клюквенный', 'Кисло-сладкий, подходит к мясу и птице.', 0, false, false, null],
        ['sousy', 'Острый айоли', 'Айоли с перчиком шрирача.', 0, false, false, null],
        ['sousy', 'Тунцовый', 'Классический, с консервированным тунцом и каперсами.', 0, false, false, null],
        ['sousy', 'Трюфельный айоли', 'Айоли с трюфельным маслом.', 0, false, false, null],

        // Десерты
        ['deserty', 'Тирамису', 'Маскарпоне, савоярди, эспрессо, какао.', 0, false, false, null],
        ['deserty', 'Шоколадный тарт', 'Песочная основа, тёмный шоколад, морская соль.', 0, false, false, null],
        ['deserty', 'Десерт La Volte (крем-брюле)', 'Легендарное крем-брюле от La Volte. Рецепт оттачивали 4 года.', 0, true, true, 'Моя страсть. Сахарная корочка тоньше бумаги — это дело практики.'],
        ['deserty', 'Маршмеллоу на огне', 'Жарим на углях прямо у стола. Печенье, шоколад.', 0, true, false, null],
        ['deserty', 'Мороженое', 'Ванильное, карамель, клубника — уточняйте у официанта.', 0, false, false, null],

        // Напитки
        ['napitki', 'Морс', 'Домашний, из самарских ягод.', 250, false, false, null],
        ['napitki', 'Вишнёвый безалкогольный глинтвейн', 'Согревающий, с корицей и гвоздикой.', 310, false, false, null],
        ['napitki', 'Вода негазированная/газированная', 'Бутылка 0,5 л.', 350, false, false, null],
        ['napitki', 'Апельсиновый фреш', 'Свежевыжатый, без добавок.', 390, false, false, null],
        ['napitki', 'Грейпфрутовый фреш', 'Свежевыжатый.', 470, false, false, null],
        ['napitki', 'Лимонад Эстрагон-цитрус', 'Домашний, не сладкий.', 250, true, false, null],
        ['napitki', 'Лимонад Персик-маракуйя', 'Яркий, тропический.', 250, false, false, null],
        ['napitki', 'Лимонад Лаванда-смородина', 'Лаванда с чёрной смородиной — наше лето.', 250, false, false, null],
        ['napitki', 'Rich Indian Tonic', 'Классика для джина.', 260, false, false, null],
        ['napitki', 'Сок Rich', 'Яблочный / вишнёвый / томатный.', 260, false, false, null],
        ['napitki', 'Coca-Cola Original', 'Бутылка 0,33 л.', 260, false, false, null],
        ['napitki', 'Эспрессо', 'Двойной, итальянская обжарка.', 190, false, false, null],
        ['napitki', 'Американо', 'Классика.', 190, false, false, null],
        ['napitki', 'Капучино', 'На цельном молоке.', 270, false, false, null],
        ['napitki', 'Латте', 'Молочный, мягкий.', 290, false, false, null],
        ['napitki', 'Флэт Уайт', 'Плотный, для ценителей.', 310, false, false, null],
        ['napitki', 'Бамбл', 'Эспрессо, апельсиновый сок, лёд.', 330, false, false, null],
        ['napitki', 'Какао', 'Натуральное, со сливками.', 420, false, false, null],
        ['napitki', 'Чай в ассортименте', 'Ассам, Эрл Грей, Моли Хуа Ча, мятный каркаде, ганпаудер, травяной, пряный, согревающий.', 320, false, false, null],
    ];

    public function run(): void
    {
        $categories = MenuCategory::all()->keyBy('slug');
        $counters = [];

        foreach ($this->items as $sortIndex => [$slug, $name, $description, $price, $featured, $chefPick, $chefComment]) {
            $category = $categories->get($slug);
            if (!$category) {
                $this->command?->warn("Category {$slug} not found, skipping {$name}");
                continue;
            }

            $pool = $this->photos[$slug] ?? [];
            $i = $counters[$slug] ?? 0;
            $photo = $pool[$i % max(count($pool), 1)] ?? null;
            $counters[$slug] = $i + 1;

            MenuItem::updateOrCreate(
                ['category_id' => $category->id, 'name' => $name],
                [
                    'description' => $description,
                    'price' => $price,
                    'photo' => $photo,
                    'is_featured' => $featured,
                    'is_chef_pick' => $chefPick,
                    'chef_comment' => $chefComment,
                    'is_available' => true,
                    'sort_order' => $sortIndex + 1,
                ]
            );
        }
    }
}
