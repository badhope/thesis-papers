import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib
matplotlib.rcParams['font.family'] = 'serif'
matplotlib.rcParams['font.serif'] = ['Times New Roman', 'Georgia', 'DejaVu Serif']
matplotlib.rcParams['axes.titlesize'] = 14
matplotlib.rcParams['axes.labelsize'] = 12
matplotlib.rcParams['xtick.labelsize'] = 11
matplotlib.rcParams['ytick.labelsize'] = 11
matplotlib.rcParams['legend.fontsize'] = 10
matplotlib.rcParams['figure.dpi'] = 300
matplotlib.rcParams['savefig.dpi'] = 300
matplotlib.rcParams['axes.linewidth'] = 1.2
import numpy as np

out_dir = r'c:\Users\Administrator\Desktop\thesis-papers\硕士论文全集\ssci\Algorithmic_Reconfiguration_Job_Architectures_LLM\Figures'
import os
os.makedirs(out_dir, exist_ok=True)

print("Regenerating Figure 2 with CORRECTED RC 2022 value (0.015 not 0.15)...")
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(9, 8), gridspec_kw={'height_ratios': [3, 1], 'hspace': 0.08})

years = [2020, 2021, 2022, 2023, 2024]
# CORRECTED: RC 2022 = 0.0150 (not 0.150)
ac_means = [0.1071, 0.1088, 0.1176, 0.1179, 0.1205]
rc_means = [0.0151, 0.0120, 0.0150, 0.0155, 0.0158]

# Upper panel: AC signal
ax1.plot(years, ac_means, 'b-o', linewidth=3, markersize=10, markerfacecolor='white', 
         markeredgewidth=2.5, markeredgecolor='blue', zorder=5)

for i, (yr, val) in enumerate(zip(years, ac_means)):
    ax1.annotate(f'{val:.3f}', xy=(yr, val), xytext=(0, 18),
                 textcoords='offset points', fontsize=11, color='blue', ha='center', fontweight='bold')

ax1.axvline(x=2022.5, color='gray', linestyle='--', linewidth=2, alpha=0.6)
ax1.annotate('ChatGPT Release\n(November 2022)', xy=(2022.5, 0.119),
             xytext=(2023.1, 0.117), fontsize=10, color='gray', fontstyle='italic',
             arrowprops=dict(arrowstyle='->', color='gray', lw=1.5))

ax1.annotate('+12.5% increase', xy=(2024, 0.1205), xytext=(2023.0, 0.1228),
             fontsize=12, color='blue', fontweight='bold',
             arrowprops=dict(arrowstyle='->', color='blue', lw=2))

ax1.set_ylabel('AC Signal Intensity', fontsize=12, fontweight='bold')
ax1.set_ylim(0.105, 0.124)
ax1.grid(True, alpha=0.3, linestyle='--')
ax1.spines['top'].set_visible(False)
ax1.spines['right'].set_visible(False)
ax1.spines['bottom'].set_visible(False)
ax1.tick_params(labelbottom=False)

# Lower panel: RC signal - FIXED values
ax2.plot(years, rc_means, 'r-s', linewidth=3, markersize=10, markerfacecolor='white',
         markeredgewidth=2.5, markeredgecolor='red', zorder=5)

for i, (yr, val) in enumerate(zip(years, rc_means)):
    ax2.annotate(f'{val:.3f}', xy=(yr, val), xytext=(0, -18),
                 textcoords='offset points', fontsize=11, color='red', ha='center', fontweight='bold')

ax2.set_xlabel('Year', fontsize=13, fontweight='bold')
ax2.set_ylabel('RC Signal Intensity', fontsize=12, fontweight='bold')
ax2.set_ylim(0.010, 0.018)
ax2.set_xticks(years)
ax2.grid(True, alpha=0.3, linestyle='--')
ax2.spines['top'].set_visible(False)
ax2.spines['right'].set_visible(False)

fig.suptitle('Figure 2. Yearly Trends in Task Signal Intensity (2020-2024)', fontsize=14, fontweight='bold', y=0.98)
fig.legend(['AC (AI-Collaborative)', 'RC (Routine Cognitive)'], loc='upper left', 
           fontsize=11, framealpha=0.9, frameon=True, bbox_to_anchor=(0.08, 0.92))

plt.savefig(os.path.join(out_dir, 'Figure2_Yearly_Trends.png'), dpi=300, bbox_inches='tight', facecolor='white')
plt.close()

# Verification
print(f"\nVerification:")
for i, (yr, val) in enumerate(zip(years, rc_means)):
    print(f"  RC {yr}: {val:.4f}")
print("Figure 2 regenerated with CORRECTED RC 2022 value!")
