import Layout from "@theme/Layout";
import KnowledgeGraph from "../components/KnowledgeGraph";

export default function KnowledgeGraphPage() {
  return (
    <Layout
      title="지식 그래프"
      description="TIL 간의 관계를 시각화한 지식 그래프"
    >
      <KnowledgeGraph />
    </Layout>
  );
}
