import { CurrentView } from "@/view/current-view";
import { Navbar } from "@/view/navbar";
import styles from "@/view/app-layout.module.css";

export const AppLayout = () => (
  <div className={styles.pageLayout}>
    <nav>
      <Navbar />
    </nav>
    <main>
      <CurrentView />
    </main>
  </div>
);
