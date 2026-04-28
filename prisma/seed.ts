import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Missing DATABASE_URL environment variable');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CATEGORIES_DATA = [
  { name: "Entertainment", icon: "🎬" },
  { name: "Food", icon: "🍕" },
  { name: "Bills", icon: "🏠" },
  { name: "Transport", icon: "🚗" },
  { name: "Savings", icon: "💰" },
];

const PAYEES_BY_CATEGORY: Record<string, string[]> = {
  Entertainment: ["Netflix", "Cinema", "Spotify", "Steam", "PlayStation Store", "Disney+"],
  Food: ["Burger King", "McDonald's", "Starbucks", "Tesco", "Lidl", "Restaurant XYZ", "Pizza Hut", "KFC"],
  Bills: ["Electric Company", "Water Supply", "Internet Provider", "Phone Plan", "Insurance"],
  Transport: ["Shell Petrol", "PKP Trains", "Bolt Taxi", "Uber", "Bus Pass", "Parking"],
  Savings: ["Savings Transfer", "Investment Fund", "Emergency Fund"],
};

async function generateTransactions() {
  try {
    // Pobranie pierwszego użytkownika z bazy
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log("❌ Brak użytkownika w bazie. Najpierw dodaj użytkownika!");
      process.exit(1);
    }

    console.log(`✅ Znaleziono użytkownika: ${user.email}`);

    // Pobranie kont finansowych dla tego użytkownika
    const financialAccounts = await prisma.financialAccount.findMany({
      where: { userId: user.id },
    });

    if (financialAccounts.length === 0) {
      console.log("❌ Brak kont finansowych dla użytkownika!");
      process.exit(1);
    }

    console.log(`✅ Znaleziono ${financialAccounts.length} kont finansowych`);

    // Tworzenie kategorii jeśli nie istnieją
    const categories = await Promise.all(
      CATEGORIES_DATA.map(async (cat) => {
        let category = await prisma.category.findFirst({
          where: { name: cat.name, userId: user.id },
        });

        if (!category) {
          category = await prisma.category.create({
            data: {
              name: cat.name,
              userId: user.id,
            },
          });
          console.log(`✅ Utworzono kategorię: ${cat.name}`);
        } else {
          console.log(`⏭️  Kategoria już istnieje: ${cat.name}`);
        }

        return category;
      })
    );

    // Generowanie 200 transakcji
    const now = new Date();
    let transactionsCreated = 0;

    for (let i = 0; i < 200; i++) {
      const categoryIndex = i % categories.length;
      const category = categories[categoryIndex];
      const account = financialAccounts[i % financialAccounts.length];

      // Losowa data w ostatnim roku
      const randomDaysAgo = Math.floor(Math.random() * 365);
      const transactionDate = new Date(now);
      transactionDate.setDate(transactionDate.getDate() - randomDaysAgo);

      // Losowa kwota w zależności od kategorii
      let amount: number;
      if (category.name === "Bills") {
        amount = Math.random() < 0.3 ? Math.random() * 500 + 500 : 0; // Co 3-4 razy i od 500-1000
      } else if (category.name === "Savings") {
        amount = Math.random() * 200 + 50;
      } else {
        amount = Math.random() * 150 + 5;
      }

      // Losowy odbiorca
      const payees = PAYEES_BY_CATEGORY[category.name] || ["Unknown"];
      const payee = payees[Math.floor(Math.random() * payees.length)];

      // Tworzenie transakcji
      await prisma.transaction.create({
        data: {
          amount: parseFloat(amount.toFixed(2)),
          date: transactionDate,
          payee,
          notes: `Mock transaction for testing - ${category.name}`,
          accountId: account.id,
          categoryId: category.id,
        },
      });

      transactionsCreated++;

      if ((i + 1) % 50 === 0) {
        console.log(`⏳ Utworzono ${i + 1}/200 transakcji...`);
      }
    }

    console.log(`\n✅ Pomyślnie utworzono ${transactionsCreated} transakcji!`);
    console.log(
      `📊 Transakcje rozsiane na ostatni rok, przypisane do ${financialAccounts.length} konta(ów)`
    );

  } catch (error) {
    console.error("❌ Błąd podczas seed'owania bazy:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

generateTransactions();
