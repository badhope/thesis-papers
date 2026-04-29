import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

plt.rcParams['font.sans-serif'] = ['SimHei', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False
sns.set_style("whitegrid")

def plot_confusion_matrix():
    categories = ['R01\n没看', 'R02\n不想看', 'R04\n重写', 'R06\n撒气', 'R17\n真的好']
    cm = np.array([
        [0.97, 0.02, 0.01, 0.00, 0.00],
        [0.03, 0.94, 0.02, 0.01, 0.00],
        [0.00, 0.01, 0.89, 0.08, 0.02],
        [0.01, 0.01, 0.05, 0.93, 0.00],
        [0.21, 0.34, 0.28, 0.17, 0.00]
    ])
    
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='.2f', cmap='Blues', 
                xticklabels=categories, yticklabels=categories,
                cbar_kws={'label': '归一化概率'})
    plt.title('图1 AdvisorBERT 混淆矩阵 (R17类召回率 = 0%)', fontsize=14, pad=20)
    plt.xlabel('预测标签', fontsize=12)
    plt.ylabel('真实标签', fontsize=12)
    plt.tight_layout()
    plt.savefig('confusion_matrix.png', dpi=300, bbox_inches='tight')
    print("混淆矩阵已保存: confusion_matrix.png")

def plot_model_comparison():
    models = ['随机猜测', '研一新生', 'BERT-base', 'RoBERTa', 'GPT-5.5', '研三师兄', 'AdvisorBERT']
    f1_scores = [5.9, 13.6, 60.0, 64.6, 45.3, 60.4, 89.7]
    colors = ['#cccccc', '#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#ff99cc', '#ff6666']
    
    plt.figure(figsize=(12, 7))
    bars = plt.bar(models, f1_scores, color=colors, edgecolor='black', linewidth=1)
    
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height + 1,
                f'{height}%', ha='center', va='bottom', fontsize=11)
    
    plt.title('图2 各模型F1值对比 (注意：GPT-5.5仍不如研三师兄)', fontsize=14, pad=20)
    plt.ylabel('F1值 (%)', fontsize=12)
    plt.xticks(rotation=15, fontsize=11)
    plt.ylim(0, 100)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.tight_layout()
    plt.savefig('model_comparison.png', dpi=300, bbox_inches='tight')
    print("模型对比图已保存: model_comparison.png")

def plot_ablation_study():
    configs = ['完整模型', '- 语境嵌入', '- 委婉度注意力', '- 延期博士生标注']
    f1_scores = [89.7, 76.3, 71.2, 58.9]
    
    plt.figure(figsize=(10, 6))
    bars = plt.bar(configs, f1_scores, color=['#e74c3c', '#3498db', '#2ecc71', '#f39c12'], 
                   edgecolor='black', linewidth=1)
    
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height + 1,
                f'{height}%', ha='center', va='bottom', fontsize=11)
    
    plt.title('图3 消融实验结果 (移除"延期博士生标注"性能下降最显著)', fontsize=14, pad=20)
    plt.ylabel('F1值 (%)', fontsize=12)
    plt.ylim(50, 95)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.tight_layout()
    plt.savefig('ablation_study.png', dpi=300, bbox_inches='tight')
    print("消融实验图已保存: ablation_study.png")

def plot_semantic_distribution():
    categories = ['R01\n我还没看', 'R02\n不想看了', 'R03\n懒得指出', 'R04\n重写吧', 
                  'R05\n感觉不好', 'R06\n撒撒气', 'R07\n家人说不行', 'R08\n纯PUA', 
                  '其他\n共9类']
    percentages = [23.4, 18.7, 15.2, 11.3, 9.8, 7.6, 5.1, 4.2, 4.7]
    
    plt.figure(figsize=(12, 7))
    colors = plt.cm.Set3(np.linspace(0, 1, len(categories)))
    wedges, texts, autotexts = plt.pie(percentages, labels=categories, colors=colors,
                                       autopct='%1.1f%%', startangle=90,
                                       textprops={'fontsize': 10})
    plt.title('图4 "再改改"17种语义分布 (我还没看占比最高)', fontsize=14, pad=20)
    plt.axis('equal')
    plt.tight_layout()
    plt.savefig('semantic_distribution.png', dpi=300, bbox_inches='tight')
    print("语义分布图已保存: semantic_distribution.png")

if __name__ == '__main__':
    print("=" * 50)
    print("《Rubbish》论文图表生成器")
    print("=" * 50)
    plot_confusion_matrix()
    plot_model_comparison()
    plot_ablation_study()
    plot_semantic_distribution()
    print("=" * 50)
    print("所有图表已生成完毕！")
    print("=" * 50)
