export default function AuthLayout({ children }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {children}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  },
  card: {
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(15px)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "340px",
    boxShadow: "0 0 40px rgba(0,198,255,0.2)",
  },
};