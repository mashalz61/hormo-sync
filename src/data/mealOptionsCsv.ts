import { parseMealCsv } from "@/utils/mealCsv";

export const mealOptionsCsv = `category,meal_name
breakfast,aloo paratha
breakfast,anda paratha
breakfast,banana smoothie
breakfast,boiled eggs
breakfast,bread and jam
breakfast,chai with biscuits
breakfast,chai with toast
breakfast,cheese omelette
breakfast,cornflakes milk
breakfast,dosa
breakfast,fried egg sandwich
breakfast,fruit chaat
breakfast,halwa puri
breakfast,idli sambar
breakfast,lassi
breakfast,milk and dates
breakfast,nihari with naan
breakfast,omelette with roti
breakfast,pancakes
breakfast,paratha with butter
breakfast,peanut butter sandwich
breakfast,poha
breakfast,porridge
breakfast,upma
breakfast,yogurt with honey
lunch,aloo gosht
lunch,bbq chicken
lunch,beef curry
lunch,biryani
lunch,burger meal
lunch,chana masala
lunch,chicken curry
lunch,chicken handi
lunch,chicken karahi
lunch,chicken pulao
lunch,club sandwich
dinner,daal chawal
lunch,fish curry
lunch,keema roti
lunch,macaroni
lunch,mixed vegetables
lunch,mutton curry
lunch,palak paneer
lunch,paneer butter masala
lunch,rajma chawal
lunch,sabzi roti
lunch,shawarma
lunch,tandoori chicken
lunch,vegetable pulao
lunch,white sauce pasta
dinner,aloo gosht
dinner,bbq chicken
dinner,beef curry
dinner,biryani
dinner,burger meal
dinner,chana masala
dinner,chicken curry
dinner,chicken handi
dinner,chicken karahi
dinner,chicken pulao
dinner,club sandwich
dinner,daal chawal
dinner,fish curry
dinner,keema roti
dinner,macaroni
dinner,mixed vegetables
dinner,mutton curry
dinner,palak paneer
dinner,paneer butter masala
dinner,rajma chawal
dinner,sabzi roti
dinner,shawarma
dinner,tandoori chicken
dinner,vegetable pulao
dinner,white sauce pasta
snacks,biscuits
snacks,cake slice
snacks,chaat
snacks,chips
snacks,chocolate
snacks,corn on cob
snacks,cupcake
snacks,donut
snacks,energy bar
snacks,french fries
snacks,fruit salad
snacks,golgappa
snacks,ice cream
snacks,milkshake
snacks,mini pizza
snacks,nachos
snacks,pakora
snacks,peanuts
snacks,popcorn
snacks,roasted nuts
snacks,samosa
snacks,sandwich
snacks,smoothie
snacks,spring rolls
snacks,tea cake`;

export const mealOptionsByCategory = parseMealCsv(mealOptionsCsv);
