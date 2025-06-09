import Categories from './Categories';
import Stats from './Stats';

export default function Sidebar({
  categories,
  passwords,
  selectedCategory,
  setSelectedCategory,
  filteredPasswords,
}) {
    return (
        <div className="w-64 bg-background-secondary/50 backdrop-blur-sm border-r border-gray-700/30 h-[calc(100vh-80px)] p-6">
          <div className="space-y-6">
            <Categories
                categories={categories}
                passwords={passwords}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
            <Stats
                passwords={passwords}
                categories={categories}
                filteredPasswords={filteredPasswords}
            />
          </div>
        </div>
    );
}