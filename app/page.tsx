import Header from "@/components/ui/Header";
import MainContent from "@/components/ui/MainContent";
import SearchBar from "@/components/ui/SearchBar";

export default function Home() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <Header />

      {/*Search & Action Toolbar */}
      <SearchBar />

      {/*Main Content Area: Grid or Empty State */}
      <MainContent />
    </div>
  );
}
