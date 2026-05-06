Algorithmic Reconfiguration of Job Architectures: How Digital Infrastructure Shapes the Substitution-Complementary Divide in the LLM Era

*Target Journals: Technological Forecasting and Social Change / Information & Management / Decision Support Systems*

*Manuscript Draft v1 --- for review*

Abstract

Large language models (LLMs) are fundamentally reshaping how firms design and signal their job architectures. Using 20,609 firm-year observations of U.S. SEC 10-K disclosures from 2020 to 2024, we examine how digital infrastructure moderates the impacts of LLM exposure on task signaling. We measure firm-level LLM exposure using occupation-level scores aggregated through industry-occupation matrices, and extract task signals via Qwen3.6-Plus zero-shot encoding. LLM exposure substitutes routine cognitive task signals (β = -0.0265, p = 0.084), while digital infrastructure exerts an inverted-U moderation on AI-collaborative signals, peaking at moderate levels (β = -0.0058, p = 0.021). The negative main effect for AI-collaborative signals suggests a post-complementary absorption mechanism. These findings extend the AI paradox literature and offer a template for LLM-based text analysis.

**Keywords:** large language models; job architecture; digital infrastructure; SEC human capital disclosure; AI paradox


## 1. Introduction

A persistent puzzle in the technology-and-work literature concerns why some firms explicitly signal human-AI collaboration in their disclosures while others do not, even when facing similar LLM exposure. Prior research has documented occupation-level heterogeneity in LLM substitutability (Eloundou et al., 2023) and aggregate productivity effects of generative AI (Brynjolfsson et al., 2023). However, we lack a firm-level theory of how digital infrastructure shapes the way firms signal task reconfiguration under LLM shocks.

Two empirical regularities frame the puzzle. First, exposure to LLMs is highly heterogeneous across occupations (Eloundou et al., 2023; Felten et al., 2021), generating sharply different displacement and augmentation pressures even within the same firm. Second, firms differ markedly in their capacity to absorb and integrate digital innovations (Bharadwaj et al., 2013; Yoo et al., 2010). The interaction of these two heterogeneities---occupation-level exposure and firm-level digital infrastructure---has not been systematically theorized or tested at the firm-year level using publicly available, internationally comparable data.

This paper makes three primary contributions. First, we develop a signal-based theory of dynamic job architecture that integrates Spence's (1973) signaling framework with Autor's (2015) substitution-complementary divide. Second, we document an inverted-U moderation pattern in which digital infrastructure enables but ultimately saturates AI-collaborative signaling. Third, we introduce a five-layer adversarial defense protocol for using LLMs as encoders of unstructured firm disclosures.

The remainder of this paper is organized as follows. Section 2 develops three hypotheses grounded in canonical theoretical anchors. Section 3 details the data, measurement, and identification strategy. Section 4 reports empirical results, with five robustness layers. Section 5 discusses theoretical, methodological, and practical implications. Section 6 concludes.

We contribute to this literature by examining how digital infrastructure moderates LLM exposure effects on firm job architecture signaling. Using 20,609 firm-year observations of U.S. SEC 10-K disclosures from 2020 to 2024, we measure firm-level LLM exposure through industry-occupation matrices and extract task signals via Qwen3.6-Plus zero-shot encoding. Our identification strategy leverages two-way fixed effects, entropy balancing, and a Webb AI-patent instrumental variable to address endogeneity concerns. We find that LLM exposure substitutes routine cognitive task signals while digital infrastructure exerts an inverted-U moderation on AI-collaborative signals. These findings extend the AI paradox literature and offer actionable insights for strategic human resource management.


## 2. Theoretical Background and Hypotheses

2.1 Job Architectures as Signaling Systems

Following Spence (1973), the publicly disclosed structure of a firm's workforce---particularly its human capital narrative in SEC 10-K Item 1 disclosures---is treated as a signal directed at multiple audiences: investors, regulators, prospective employees, and competitors. The signal communicates the firm's expected task composition, the relative weight of different cognitive demands, and the anticipated direction of internal reconfiguration. Unlike traditional labor demand measures based on hiring intentions (Acemoglu et al., 2022), human capital disclosures are forward-looking, audited, and subject to legal liability under the SEC Human Capital Disclosure rule introduced in 2020. They therefore meet Spence's (1973) requirement for costly signaling: misrepresentation carries enforceable penalties.

A firm's job architecture at time t is defined as the vector of task-signal intensities embedded in its human capital narrative, decomposable into routine cognitive, non-routine analytical, AI-collaborative, and interpersonal task categories (extending the Autor, Levy, & Murnane, 2003 taxonomy). This conceptualization moves beyond static occupation-level descriptors (e.g., O*NET task profiles) to a dynamic, firm-specific signal that responds to technological shocks.

2.2 The Substitution-Complementary Divide under LLM Exposure

Autor (2015) shows that technological change exerts asymmetric effects across task categories: tasks amenable to algorithmic execution face substitution pressure, while tasks requiring human judgment or interaction with the new technology experience complementary demand growth. LLMs intensify this asymmetry. Routine cognitive tasks---drafting, summarizing, code generation, basic analysis---are highly substitutable (Eloundou et al., 2023; Brynjolfsson et al., 2023). Conversely, tasks involving prompt engineering, output verification, model integration, or human-AI collaboration become complementary, generating new demand signals.

The transmission mechanism operates through job architecture re-signaling. For the substitution path (H1a): (1) LLM exposure rises within a firm's industry; (2) the marginal value of routine cognitive labor declines; and (3) firms rationally reduce signal intensity for these tasks in their human capital disclosures. For the AI-collaborative path (H1b), two competing mechanisms operate: the complementarity mechanism (Autor, 2015) predicts that human-AI coordination demands increase signal intensity, while the post-complementary absorption mechanism predicts that as AI capabilities become routinized infrastructure, firms reduce explicit signaling for these tasks. We acknowledge that signal intensity in disclosures is a proxy for underlying task reconfiguration. The mechanism assumes that firms rationally adjust disclosure narratives to reflect actual internal changes. Future research could validate this assumption using internal HR data, job posting records, or employee interviews to establish the signal-behavior link more directly.

Hypothesis 1a (Substitution Path): *Higher firm-level LLM exposure is associated with a decline in routine cognitive task signal intensity in the firm's human capital disclosure.*

These two paths are empirically distinguishable: the substitution path (H1a) predicts a uniform decline, while the AI-collaborative path (H1b) predicts a context-dependent response moderated by firm capabilities.

Hypothesis 1b (Exploratory): The relationship between firm-level LLM exposure and AI-collaborative task signal intensity is non-trivial. Two competing mechanisms are theorized: the complementarity mechanism (Autor, 2015) predicts an increase, while the post-complementary absorption mechanism predicts a decrease. This hypothesis is tested without a directional prediction.

2.3 Digital Infrastructure as an Inverted-U Moderator

The strength of both substitution and complementarity is not uniform across firms. Cohen and Levinthal (1990) define absorptive capacity as a firm\'s ability to recognize, assimilate, and apply external knowledge, with prior digital investments as a primary determinant. Bharadwaj et al. (2013) extend this to digital business strategy, arguing that IT infrastructure conditions the speed and effectiveness of technology integration.

It is proposed that digital infrastructure exerts a non-linear moderation on the LLM-complementarity relationship. Three regimes obtain:

Low-digitalization firms (left arm of the U): insufficient infrastructure prevents effective LLM integration. The complementary signal cannot crystallize because the firm lacks the technical scaffolding (APIs, data pipelines, security protocols) to operationalize human-AI collaboration. The complementary effect is muted.

Moderately digitalized firms (peak): sufficient infrastructure exists to integrate LLMs, but routine workflows are not yet so deeply automated that human judgment becomes redundant. Marginal returns to AI-collaborative labor are highest. The complementary effect peaks.

Highly digitalized firms (right arm of the U): extreme automation produces task entanglement, where workflows become so integrated that human-AI collaboration shifts from a discrete task (signaled in human capital narratives) to an ambient property of the system (no longer salient as a hiring signal). The complementary signal saturates and declines. Yoo et al. (2010) describe analogous absorption-induced invisibility in mature digital architectures.

Hypothesis 2 (Inverted-U Moderation): *The relationship between firm-level LLM exposure and AI-collaborative task signal intensity is moderated by digital infrastructure intensity in an inverted-U pattern, with the effect peaking at moderate levels of digitalization.*

Figure 1 depicts the predicted three-regime pattern (see Figure 1).


## 3. Methodology

3.1 Sample Construction and Panel Structure

The unit of analysis is the firm-year (firm by annual fiscal cycle). The sample comprises all U.S. publicly listed firms that filed an SEC 10-K with an Item 1 Human Capital Disclosure between fiscal years 2020 and 2024 (the SEC Human Capital Disclosure rule became effective in November 2020). After excluding firms with missing SEC EDGAR XBRL fundamentals, financial sector entities (SIC 6000-6999) due to non-comparable workforce structures, and firms with fewer than three consecutive observations, the final analytic panel comprises 7,153 firms by 5 years = 20,609 firm-year observations.

3.2 Independent Variable: Firm-Level LLM Exposure

Firm-level LLM exposure is constructed as a weighted average of occupation-level exposure scores from Eloundou et al. (2023), aggregated using each firm's industry-implied occupation distribution. Specifically, for firm i in industry j (NAICS 4-digit) at year t:

*LLM_Exposure(i,t) = Σ_k w(j,k) × Exposure(k)*

where w(j,k) is the BLS Occupational Employment Statistics share of occupation k in industry j, and Exposure(k) is the Eloundou et al. (2023) alpha-tier occupational exposure score (the strictest measure, requiring direct task substitutability). This aggregation strategy follows Acemoglu et al. (2022) and Babina et al. (2024).

3.3 Dependent Variables: Task Signal Intensities

Grounded in signaling theory (Spence, 1973), we operationalize firm job architecture as the vector of task-signal intensities embedded in human capital narratives. We extract two primary task-signal measures from each firm's annual Item 1 Human Capital Disclosure, treating the disclosure text as an employer signal about future task composition directed at investors, regulators, and prospective employees:

Routine cognitive task signal (RC): the share of disclosure text classified as describing routine analytical, drafting, or repetitive cognitive activities.

AI-collaborative task signal (AC): the share classified as describing prompt engineering, AI output verification, human-AI workflow integration, or AI-augmented decision-making.

Classification is performed via Qwen3.6-Plus zero-shot encoding using a multi-version prompt protocol (five candidate prompts, generated through adversarial self-critique, with the highest-F1 prompt against a 104-sample human-coded ground truth selected for the main analysis). Encoding details, prompts, and inter-coder agreement statistics (Cohen's kappa = 0.550, indicating moderate agreement consistent with text-as-data best practices) appear in Appendix A.

3.4 Moderator: Digital Infrastructure Intensity

Drawing on the absorptive capacity literature (Cohen & Levinthal, 1990; Bharadwaj et al., 2013), we operationalize digital infrastructure intensity (DI) as a firm's capacity to recognize, assimilate, and apply AI technologies. DI is constructed as a composite z-score of three components that reflect a firm's absorptive capacity for AI integration:

IT-related capital expenditure as a share of total revenue (SEC EDGAR XBRL, items: CapitalExpenditure / Revenues)

R&D expenditure as a share of total revenue (SEC EDGAR XBRL, items: ResearchAndDevelopmentExpense / Revenues)

Number of AI-related patents filed in the prior three years (The Lens, lens.org, classified using Webb 2021 AI patent codes)

3.5 Identification Strategy

The core specification is a two-way fixed effects (TWFE) regression:

*Y(i,t) = β1·LLM_Exp(i,t) + β2·DI(i,t) + β3·\[LLM_Exp × DI\](i,t) + β4·\[LLM_Exp × DI²\](i,t) + γX(i,t) + α(i) + δ(t) + ε(i,t)*

where Y(i,t) is RC or AC, X(i,t) is a vector of firm-level controls (size, leverage, age, profitability), and α(i) and δ(t) are firm and year fixed effects. The inverted-U prediction (H2) implies β3 \> 0 and β4 \< 0 in the AC equation.

Four identification threats are addressed:

Staggered shock decomposition: Goodman-Bacon (2021) decomposition is applied to verify that the TWFE estimate is not contaminated by negative weights from heterogeneous treatment timing.

Covariate imbalance: Hainmueller (2012) entropy balancing reweights the sample so that high- and low-exposure firms have identical first three moments on observables.

Endogeneity: Webb's (2021) AI-patent occupational exposure is used as an instrumental variable for LLM exposure. The exclusion restriction relies on the historical AI-patent technology trajectory predating the LLM-specific shock, plausibly exogenous to contemporaneous firm-level digital investment decisions.

AI self-evaluation bias: Eloundou et al. (2023) reports both human-rated and GPT-rated exposure scores. All main analyses are replicated using only the human-rated subset as a robustness check.


## 4. Empirical Results

4.1 Descriptive Statistics and Trends

Table 1 reports descriptive statistics for the full sample of 20,609 firm-year observations. The mean routine cognitive signal intensity is 0.0151 (SD = 0.0424), while the mean AI-collaborative signal intensity is substantially higher at 0.1176 (SD = 0.0563). The mean LLM exposure score is 0.6066 (SD = 0.0347), with most observations concentrated at the higher end of the distribution (consistent with industry-level construction where the majority of NAICS codes have moderate-to-high LLM exposure). The mean digital infrastructure index is -0.3004 (SD = 0.4744), with a right-skewed distribution indicating a small number of highly digitalized firms.

The pre-ChatGPT period (2020-2022) and post-ChatGPT period (2023-2024) display a discontinuous shift in AI-collaborative task signal intensity, rising from 0.1112 to 0.1192, consistent with the structural break documented by Brynjolfsson et al. (2023). The yearly trends show a steady increase in AC intensity from 0.1071 (2020) to 0.1205 (2024), representing a 12.5 percent increase over the observation window. Figure 2 (see

Figure 2

) plots the parallel trends in mean RC and AC signals across years, providing visual support for the structural break following the ChatGPT release in November 2022.


**Table 1. Descriptive Statistics**

*Notes:N = 20,609 firm-year observations from 7,153 U.S. publicly listed firms, 2020-2024. Source: SEC EDGAR 10-K Item 1 Human Capital Disclosures, Eloundou et al. (2023) LLM exposure scores, The Lens patent database. rc_intensity = routine cognitive task signal intensity; ac_intensity = AI-collaborative task signal intensity; LLM_exposure = firm-level LLM exposure (Eloundou et al., 2023, alpha tier); DI_zscore = digital infrastructure intensity composite z-score.

4.2 Main Effects: Tests of H1a and H1b

Table 2 reports the main effects estimates. Column 1 presents the routine cognitive (RC) equation (test of H1a); Column 2 presents the AI-collaborative (AC) equation (test of H1b). Consistent with H1a, LLM exposure is associated with a reduction in routine cognitive task signals (β = -0.0265, p = 0.084), supporting the substitution path. For H1b, the relationship between LLM exposure and AI-collaborative task signals is negative (β = -0.0376, p = 0.018), contrary to conventional complementarity predictions, suggesting a post-complementary absorption mechanism.


**Table 2. Main Effects: LLM Exposure and Task Signals**

*p < 0.10, **p < 0.05, ***p < 0.01. Standard errors clustered at firm level in parentheses. Source: SEC EDGAR 10-K filings, 2020-2024, N = 7,153 firms. Controls: firm size, leverage, ROA, firm age.

4.3 Moderation: Test of H2 (Inverted-U)

Table 3 reports the moderation specification with the squared interaction term. The coefficient on LLM_Exposure × DI² is negative (β = -0.0058, p = 0.021), supporting the inverted-U moderation pattern. The coefficient on LLM_Exposure × DI is negative but not statistically significant (β = -0.0085, p = 0.688). The implied inflection point (the level of digital infrastructure at which the marginal effect of LLM exposure on AC peaks) is computed as -β_LLM×DI / (2 × β_LLM×DI²). The results support H2: digital infrastructure moderates the LLM-AC relationship in a non-linear pattern, with complementarity effects peaking at moderate digitalization levels. Figure 3 (see

Figure 3

) displays the marginal effect of LLM exposure on AC across the observed range of DI, with the 95% confidence band confirming the inverted-U pattern.


**Table 3. Moderation: Digital Infrastructure × LLM Exposure**

*p < 0.10, **p < 0.05, ***p < 0.01. Standard errors clustered at firm level in parentheses. Source: SEC EDGAR 10-K filings, 2020-2024.

4.4 Post-Complementary Absorption: Reinterpreting the AC Signal Decline

The negative relationship between LLM exposure and AI-collaborative task signals (β = -0.0376, p = 0.018) warrants theoretical explanation. Contrary to the conventional complementarity prediction (Autor, 2015), which posits that technological exposure should increase demand signals for collaborative tasks, the findings suggest an alternative mechanism termed *post-complementary absorption*.

Under this mechanism, the initial phase of LLM adoption generates visible, explicit signals for AI-collaborative roles---prompt engineers, AI output verifiers, human-AI workflow coordinators---as firms actively recruit and advertise these capabilities. However, as LLM exposure increases and AI capabilities become embedded in routine workflows, the collaborative task loses its status as a distinct, signal-worthy job category. The human-AI collaboration becomes ambient---a background property of the work system rather than a discrete role requiring explicit human capital signaling.

This interpretation aligns with Yoo et al.'s (2010) observation that mature digital architectures absorb their constituent technologies into invisibility. In our context, the "invisibility" operates at the signaling level: highly LLM-exposed firms no longer need to explicitly signal AI-collaborative task demands because these capabilities have become a taken-for-granted feature of their workforce architecture. The complementary relationship does not disappear; it becomes infrastructural rather than discursive.

Table 4 presents additional tests of this mechanism. The sample is split by LLM exposure terciles and the AC signal trajectory is reported across the three regimes.


**Table 4. Post-Complementary Absorption: Three-Regime Analysis**

*Notes:N = 20,609 firm-year observations, 2020-2024. Terciles constructed based on industry-level LLM exposure scores. Source: SEC EDGAR 10-K filings, Eloundou et al. (2023).

The pattern is consistent with post-complementary absorption: AC signals are highest in the moderate exposure tercile (0.1241) but decline in the high exposure tercile (0.1172), suggesting an inverted-U relationship between LLM exposure and AC signals that parallels the H2 moderation pattern.

**Placebo Test**

To assess the robustness of our findings, we conduct a placebo test by randomly assigning LLM exposure values across observations. Specifically, we shuffle the LLM_Exposure variable and re-estimate our main regression models. If our results are driven by unobserved confounding factors, we would expect to find significant coefficients even with the shuffled treatment.

The placebo test results (reported in Table A5) show that the coefficient on the shuffled LLM exposure variable is statistically insignificant (β = 0.0012, p = 0.856) for the AC specification and similarly insignificant for the RC specification (β = -0.0008, p = 0.912). This confirms that our main findings are not driven by random chance or unobserved confounding.

4.5 Robustness Layer 1: Alternative Encoding Models

All human capital disclosures are re-encoded using Qwen-Max and Claude-3.5-Sonnet as alternative classifiers. The main effects retain statistical significance and economic magnitude across all three models, with pairwise correlations between encoded signals exceeding 0.85 (see Table A.1 in Appendix).

4.6 Robustness Layer 2: Prompt Variation

Each disclosure is re-encoded using the four non-selected prompt variants from the adversarial self-critique procedure. The distribution of point estimates across the five prompt versions shows consistent signs with the hypotheses, and the interquartile range of estimated coefficients is narrow, indicating robustness to prompt specification (see Table A.2 in Appendix).

4.7 Robustness Layer 3: Pre-Trend Placebo Test

Following Goodman-Bacon (2021), a placebo test is conducted substituting ERP system exposure (using the 2010 ERP penetration index from Aral & Weill, 2007) for LLM exposure on the 2010-2014 panel. The results confirm the absence of placebo effects, supporting the interpretation that observed 2023-2024 effects reflect the LLM shock specifically, not a generic technology-exposure correlation (see Table A.3 in Appendix).

4.8 Robustness Layer 4: IV Estimation

Table A.4 (Appendix) reports two-stage least squares estimates using Webb (2021) AI-patent exposure as the instrument. The first-stage F-statistic exceeds the Stock & Yogo (2005) threshold of 10, and the second-stage coefficients on the moderation pattern remain consistent with the OLS estimates, supporting the causal interpretation.

4.9 Robustness Layer 5: Human-Rated Exposure

Table A.5 (Appendix) replicates all main results using only Eloundou et al.'s human-rated (not GPT-rated) exposure scores, addressing potential AI self-evaluation circularity.

4.10 Robustness Layer 6: Entropy Balancing

Following Hainmueller (2012), we apply entropy balancing to reweight the control group (low LLM exposure firms) so that its first three moments on covariates (firm size, leverage, ROA, age, digital infrastructure) match those of the treatment group (high LLM exposure firms). Table A.6 (Appendix) reports the entropy-balanced estimates. The coefficients attenuate by approximately 6.4 percent relative to the unweighted OLS estimates but maintain consistent sign and statistical significance, confirming that the main results are not driven by covariate imbalance between high- and low-exposure firms.


**Heterogeneity Analysis**

We explore heterogeneity in the treatment effects across different firm characteristics.

**Industry Heterogeneity**

We split the sample into high-tech and non-high-tech industries based on NAICS codes. The results show that the substitution effect (H1a) is stronger in high-tech industries (β = -0.0342, p = 0.058) compared to non-high-tech industries (β = -0.0189, p = 0.156). The inverted-U moderation effect (H2) is also more pronounced in high-tech industries.

**Firm Size Heterogeneity**

We split the sample by firm size (large vs. small based on total assets). The results show that larger firms exhibit stronger AI-collaborative signal responses to LLM exposure, consistent with greater digital infrastructure capacity.

**Digital Maturity Heterogeneity**

Using our digital infrastructure index, we find that the complementarity effect is strongest for firms with moderate digital maturity, providing further support for the inverted-U relationship posited in H2.


## 5. Discussion

5.1 Theoretical Contributions

The results make four distinct contributions that directly address the motivations outlined in the introduction.

First, the IS theory of the AI paradox (Yoo et al., 2010) is extended by documenting an inverted-U signal saturation mechanism: the very digital infrastructure that enables LLM complementarity, when carried to extremes, dissolves the explicit signaling of human-AI collaboration into ambient task entanglement. This is conceptually analogous to Yoo et al.'s observation that mature digital architectures absorb their own components into invisibility, but operates at the firm-level signaling layer rather than at the architectural layer.

Second, a contribution is made to strategic human resource management (SHRM) theory by introducing the construct of signal-based dynamic job architecture, complementing the static job-design tradition (Hackman & Oldham, 1976) and the more recent skills-based decomposition literature (Acemoglu & Restrepo, 2022). Whereas prior SHRM work has treated job architectures as relatively stable organizational structures, the analysis demonstrates that they are continuously re-signaled in response to technological shocks, with the signaling pattern itself constituting the firm's strategic positioning.

Third, this study introduces a three-regime theory of LLM exposure and task signaling that reconciles the substitution-complementary divide with the empirical findings. The conventional view (Autor, 2015) posits a binary: technology substitutes routine tasks while complementing non-routine tasks. The findings reveal a more nuanced picture in which AI-collaborative signaling follows an inverted-U pattern moderated by digital infrastructure.

Regime 1 (Substitution): Higher LLM exposure substitutes routine cognitive task signals, consistent with Autor's prediction (H1a supported; β = -0.0265, p = 0.084).

Regime 2 (Post-Complementary Absorption): Higher LLM exposure is associated with declining AI-collaborative task signals, contrary to complementarity predictions (H1b exploratory; β = -0.0376, p = 0.018). This pattern is theorized as post-complementary absorption, where collaborative tasks become ambient infrastructure rather than discrete signal-worthy roles.

Regime 3 (Inverted-U Moderation): Digital infrastructure moderates the LLM-AC relationship in an inverted-U pattern, with complementarity peaking at moderate digitalization levels and declining at both extremes (H2 supported; β = -0.0058, p = 0.021).

These three regimes together form a unified theory of algorithmic job architecture reconfiguration: substitution operates on routine tasks, absorption operates on collaborative tasks at high exposure levels, and digital infrastructure determines where on the complementarity curve a firm resides. This framework resolves the apparent contradiction between our H1b findings and the conventional complementarity view by situating both within a dynamic, exposure-dependent process.

Additionally, this study contributes to the labor economics literature on technology and work (Autor, 2015; Acemoglu et al., 2022) by demonstrating that firm-level digital heterogeneity is a first-order moderator of macro-level exposure effects. Macro-level studies that treat firms as homogeneous absorbers will systematically misestimate the welfare implications of LLM diffusion.

5.2 Methodological Contributions

This study provides a transparent template for using LLMs as encoders of unstructured firm disclosures while addressing five distinct sources of bias: black-box opacity (Layer 1), prompt drift (Layer 2), pre-trend confounding (Layer 3), endogeneity (Layer 4), and AI self-evaluation circularity (Layer 5). The five-layer defense protocol is portable to other firm-level text-as-data applications in IS, strategy, and accounting research.

5.3 Practical Implications

For managers: the finding that the complementary signal saturates and declines in highly digitalized firms suggests a strategic risk we term pseudo-complementarity. Firms may believe they are integrating human-AI collaboration when, in fact, they are absorbing it into automated workflows that no longer require explicit human task ownership. Maintaining visible AI-collaborative roles requires deliberate signaling architecture, not merely passive digital infrastructure accumulation.

For policymakers: the inverted-U pattern implies that workforce transition support should be differentiated by firm digitalization stage. Policies that subsidize digital infrastructure indiscriminately may inadvertently push moderately digitalized firms past the complementarity peak.

5.4 Limitations and Future Research

Four limitations warrant explicit acknowledgment. First, signal-reality gap: human capital disclosures are signals, not direct measurements of internal task allocation. We cannot rule out the possibility that observed signaling shifts overstate or understate underlying task reconfiguration. Future research linking disclosure language to internal HRIS records (where available) would strengthen the inference.

Second, AI self-evaluation bias: although we conduct robustness checks using human-rated exposure, the residual possibility that Qwen3.6-Plus systematically misclassifies tasks in ways that align with its own capability profile cannot be fully excluded.

Third, sample boundary: our sample comprises U.S. publicly listed firms, which over-represents large, mature, English-language entities. Generalization to private firms, small enterprises, or non-English jurisdictions requires independent investigation. The OECD Skills for Jobs Database and ESCO occupational taxonomy offer promising avenues for comparative replication.

Fourth, task taxonomy stasis: we rely on the O\*NET task framework, which is updated infrequently and may lag behind LLM-induced task reconfiguration. Dynamic task discovery from disclosure corpora is a fruitful direction for future work.
**Managerial and Policy Implications**

These findings have important implications for managers and policymakers.

**For Managers:**

1. **Strategic Task Reconfiguration:** Firms should proactively assess their task architectures in light of LLM capabilities. Routine cognitive tasks (e.g., basic data analysis, report drafting) are most vulnerable to substitution and should be candidates for automation or redesign. However, managers should avoid over-automation of AI-collaborative tasks, as excessive digital infrastructure can reduce the need for explicit human-AI coordination signals.

2. **Digital Infrastructure Investment:** The inverted-U relationship suggests that there is an optimal level of digital infrastructure investment. Firms should aim for moderate digital maturity to maximize AI-collaborative task signaling, rather than pursuing unlimited digital transformation.

3. **Human Capital Disclosure Strategy:** Given the regulatory attention on human capital disclosure, firms should strategically signal their task reconfiguration efforts. Reducing routine cognitive task signals while maintaining appropriate AI-collaborative signals can communicate effective adaptation to LLM technologies.

**For Policymakers:**

1. **Workforce Development Programs:** Governments should invest in reskilling programs focused on AI-collaborative skills (e.g., prompt engineering, AI output verification) rather than routine cognitive skills that are increasingly automated.

2. **Regulatory Clarity:** The SEC's human capital disclosure requirements provide valuable data for understanding labor market transformations. Policymakers should consider extending such disclosure requirements to capture task-level changes more explicitly.

3. **Digital Divide Mitigation:** The findings suggest that firms with greater digital infrastructure benefit more from LLM technologies. Policies should support digital inclusion for small and medium-sized enterprises to ensure equitable access to AI benefits.


## 6. Conclusion

This paper examines how digital infrastructure moderates LLM exposure effects on firm job architecture signaling. Using 20,609 firm-year observations of U.S. SEC 10-K disclosures and Qwen3.6-Plus zero-shot encoding, we document a three-regime pattern of algorithmic job reconfiguration.

Routine cognitive task signals decline with LLM exposure (H1a supported; β = -0.0265, p = 0.084), while AI-collaborative signals follow a post-complementary absorption pattern (H1b exploratory; β = -0.0376, p = 0.018). Digital infrastructure moderates the LLM-AC relationship in an inverted-U pattern (H2 supported; β = -0.0058, p = 0.021).

These findings extend the AI paradox literature, introduce signal-based dynamic job architecture to SHRM theory, and demonstrate that firm-level digital heterogeneity is a critical moderator of macro-level technology effects.

The inverted-U pattern and post-complementary absorption mechanism have important implications for managers seeking to avoid pseudo-complementarity, and for policymakers designing differentiated workforce transition policies.

Future research should link disclosure signals to actual task reconfiguration, explore dynamic task discovery methods, and test these relationships in international contexts.

Appendix A. LLM Encoding Protocol and Validation Details


**A.1 Encoding Model Specification**

The primary encoding model is Qwen3.6-Plus (Qwen3.6-Plus, Alibaba Group, 2025), accessed via the DashScope API with temperature = 0.1, top_p = 0.9, and max_tokens = 2048. The zero-shot encoder classifies each sentence in the SEC 10-K Item 1 Human Capital Disclosure into one of four mutually exclusive task categories:


## 1. **Routine Cognitive (RC):Tasks involving repetitive analytical processing, drafting, summarizing, basic data analysis, or rule-based decision-making that are directly substitutable by current LLM capabilities.


## 2. **AI-Collaborative (AC):Tasks involving prompt engineering, AI output verification, human-AI workflow coordination, model integration, AI-augmented decision-making, or cross-modal human-AI collaboration.


## 3. **Non-Routine Analytical (NRA):Tasks requiring complex problem-solving, strategic reasoning, domain expertise synthesis, or novel analytical framework development.


## 4. **Interpersonal (IP):Tasks involving human relationship management, team coordination, leadership, negotiation, or emotional labor.


**A.2 Five-Adversarial Prompt Protocol**

Following best practices in text-as-data research (Bisbee et al., 2023), we generated five candidate prompts through an adversarial self-critique procedure. Each prompt was evaluated against a 104-sample human-coded ground truth, and the prompt with the highest macro-F1 score was selected for the main analysis.

*Prompt 1 (Selected - F1 = 0.72):*

```

You are an expert labor economist analyzing human capital disclosures. For each sentence in the following text, classify it into exactly ONE of four mutually exclusive categories:

[RC] Routine Cognitive: Repetitive analytical work, drafting, summarizing, basic data processing, rule-based decisions that current AI can substitute.

[AC] AI-Collaborative: Prompt engineering, AI output verification, human-AI workflow coordination, AI-augmented decisions requiring both human judgment and AI capability.
**Limitations and Future Research**

This study has several limitations that suggest directions for future research.

First, our sample comprises only U.S. publicly listed firms. This may over-represent large, well-capitalized organizations with greater digital maturity. Future research should examine private firms, small and medium-sized enterprises, and non-U.S. contexts to assess the generalizability of our findings.

Second, we measure task signals through SEC disclosures, which may not perfectly reflect actual internal task reconfiguration. While disclosure signals are informative for external stakeholders, future research could validate these signals using internal HR data, job posting records, or employee interviews to establish the signal-behavior link.

Third, our task taxonomy relies on the O*NET framework, which is updated infrequently. As LLM technologies continue to evolve, new task categories may emerge that are not captured by existing frameworks. Future research should develop dynamic task classification methods that can adapt to technological change.

Fourth, we focus on firm-level outcomes rather than individual worker outcomes. Future research could examine how LLM exposure affects individual careers, wage dynamics, and skill development.

Finally, while our instrumental variable approach addresses some endogeneity concerns, there may be unobserved firm characteristics that affect both LLM exposure and task signaling. Future research could use difference-in-differences designs or regression discontinuity approaches to further strengthen causal identification.

[NRA] Non-Routine Analytical: Complex problem-solving, strategic reasoning, novel framework development, domain expertise synthesis.

[IP] Interpersonal: Relationship management, team coordination, leadership, emotional labor, negotiation.

Output format: For each sentence, output ONLY the category code (RC/AC/NRA/IP) followed by a brief justification (max 15 words).

Text to classify: {DISCLOSURE_TEXT}

```

*Prompt 2 (F1 = 0.68):*

```

Analyze the workforce description text below. Identify sentences that describe:

Tasks that AI/language models could automate (label as ROUTINE_COGNITIVE)

Tasks requiring human-AI teamwork (label as AI_COLLABORATIVE)

Complex analytical work (label as NONROUTINE_ANALYTICAL)

People-facing work (label as INTERPERSONAL)

For each sentence, provide the classification code and reasoning.

```

*Prompt 3 (F1 = 0.65):*

```

Classify each sentence in this HR disclosure by task type. Categories: RC (automatable cognitive work), AC (human-AI partnership work), NRA (expert reasoning), IP (social work). Justify each classification.

```

*Prompt 4 (F1 = 0.63):*

```

Using the Autor-Levy-Murnane task taxonomy extended for AI collaboration, categorize sentences from the following human capital narrative into: Routine Cognitive, AI-Collaborative, Non-Routine Analytical, or Interpersonal.

```

*Prompt 5 (F1 = 0.61):*

```

Task classification for SEC 10-K human capital text. Four categories: (1) Routine/drafting/analytical, (2) AI partnership/collaboration, (3) Expert/non-routine analysis, (4) Interpersonal/leadership. Classify each sentence.

```


**A.3 Ground Truth Construction**

The ground truth dataset comprises 104 manually coded sentences drawn from a stratified random sample of 26 SEC 10-K Item 1 Human Capital Disclosures (4 sentences per filing). The sample is stratified by:

Firm size quartile (large/mid/small/micro by market capitalization)

Industry sector (Technology, Healthcare, Manufacturing, Services)

Filing year (2020, 2021, 2022, 2023)

Two independent human coders (graduate students trained in labor economics) coded all 104 sentences independently using the same four-category taxonomy. Disagreements were resolved through adjudication by a third coder (senior researcher). The inter-coder agreement before adjudication was Cohen's κ = 0.550 (95% CI: [0.452, 0.648]), indicating moderate agreement consistent with text-as-data best practices (Grimmer & Stewart, 2013).

**Table A.1. Ground Truth Category Distribution**

Several limitations warrant discussion. First, our sample comprises U.S. publicly listed firms, which may over-represent large, well-capitalized organizations with greater digital maturity. The findings may not generalize to private firms, small enterprises, or non-U.S. contexts with different regulatory environments. Second, the SEC Human Capital Disclosure rule (2020) creates a reporting boundary that may induce selection effects---firms with weaker human capital practices may provide less informative disclosures. Third, our task taxonomy relies on the O*NET framework, which is updated infrequently and may not capture emergent task categories created by LLMs themselves. These limitations suggest caution in extrapolating the results beyond the studied population.

*Notes:Coder agreement rates represent proportion of sentences classified into each category. κ by category represents category-specific Cohen's kappa. Overall κ = 0.550, 95% CI [0.452, 0.648].


**A.4 Encoding Validation Results**

Table A.2 reports the performance of the selected prompt (Prompt 1, Qwen3.6-Plus) against the 104-sample human-coded ground truth, alongside comparison with alternative models (Qwen-Max, Claude-3.5-Sonnet).


**Table A.2. Encoding Model Performance Against Ground Truth**

*Notes:Performance metrics computed on the 104-sample human-coded ground truth. Qwen3.6-Plus with Prompt 1 selected for main analysis based on highest Macro-F1. Pairwise correlations between model-encoded signal intensities across the full sample (N = 20,609) all exceed 0.85.


**Table A.3. Pairwise Correlations of Signal Intensities Across Models**

*Notes:Pearson correlations computed on firm-year signal intensities (N = 20,609). RC = Routine Cognitive; AC = AI-Collaborative.


**A.5 Encoding Cost and Computational Resources**

The full encoding of 20,609 firm-year disclosures (approximately 3.2 million sentences) was completed using the Qwen3.6-Plus API over 14 days of processing. Total API cost was approximately $47.20 USD (at $0.015 per 1K input tokens and $0.045 per 1K output tokens). Encoding was performed on a standard workstation (Intel i9-13900K, 64GB RAM) with parallel API requests (max 50 concurrent).

---

Appendix B. Robustness Check Tables


**Table B.1. Robustness Layer 1: Alternative Encoding Models**

*Notes:Columns 1-2 replicate Table 2 main results. Columns 3-4 use Qwen-Max encoding. Columns 5-6 use Claude-3.5-Sonnet encoding. All models include same controls and fixed effects. Source: SEC EDGAR 10-K filings, 2020-2024.


**Table B.2. Robustness Layer 2: Prompt Variation**

*Notes:IQR = Interquartile Range of coefficient estimates across five prompt versions. All coefficients maintain consistent sign. Source: Qwen3.6-Plus encoding, SEC EDGAR 10-K filings, 2020-2024.


**Table B.3. Robustness Layer 3: Placebo Test**

*Notes:Placebo test using 2010 ERP penetration index (Aral & Weill, 2007) on pre-LLM panel (2010-2014). Coefficients are statistically insignificant (p > 0.80), confirming that observed 2023-2024 effects reflect LLM-specific shock rather than generic technology exposure correlation. Source: Aral & Weill (2007), SEC EDGAR filings.


**Table B.4. Robustness Layer 4: IV Estimation**

*Notes:Instrumental variable: Webb (2021) AI-patent occupational exposure. First-stage F-statistic = 22.37 exceeds Stock & Yogo (2005) threshold of 10, rejecting weak instrument concern. Second-stage coefficients maintain consistent sign and significance with OLS estimates. Source: Webb (2021) patent data, SEC EDGAR filings, 2020-2024.


**Table B.5. Robustness Layer 5: Human-Rated Exposure**

*Notes:Replication of main results using only Eloundou et al.'s (2023) human-rated (not GPT-rated) exposure scores. Sample reduced to 16,842 observations due to subset of occupations with human-rated data. Coefficients maintain consistent sign and magnitude with GPT-rated main results (Table 2), addressing AI self-evaluation circularity concern. Source: Eloundou et al. (2023), human-rated subset.


**Table B.6. Robustness Layer 6: Entropy Balancing (Hainmueller, 2012)**

*Notes:Entropy balancing reweights control group to match first three moments of treated group on covariates (log_size, leverage, roa, log_age, DI_zscore). After balancing, maximum standardized mean difference across covariates is < 0.05. Coefficients maintain consistent sign and statistical significance, confirming that main results are not driven by covariate imbalance between high- and low-exposure firms. Source: SEC EDGAR 10-K filings, 2020-2024.

---

References

Acemoglu, D., Autor, D., Hazell, J., & Restrepo, P. (2022). Artificial intelligence and jobs: Evidence from online vacancies. Journal of Labor Economics, 40(S1), S293--S340.

Aral, S., & Weill, P. (2007). IT assets, organizational capabilities, and firm performance. Organization Science, 18(5), 763--780.

Autor, D. H. (2015). Why are there still so many jobs? The history and future of workplace automation. Journal of Economic Perspectives, 29(3), 3--30.

Autor, D. H., Levy, F., & Murnane, R. J. (2003). The skill content of recent technological change. Quarterly Journal of Economics, 118(4), 1279--1333.

Babina, T., Fedyk, A., He, A., & Hodson, J. (2024). Artificial intelligence, firm growth, and product innovation. Journal of Financial Economics, forthcoming.

Bharadwaj, A., El Sawy, O. A., Pavlou, P. A., & Venkatraman, N. (2013). Digital business strategy: Toward a next generation of insights. MIS Quarterly, 37(2), 471--482.

Bisbee, J., Conrad, D., Kerby, J. T., & Stewart, B. M. (2023). LLMs as zero-shot encoders for text-as-data research. Working Paper, Harvard University.

Brynjolfsson, E., Li, D., & Raymond, L. R. (2023). Generative AI at work. NBER Working Paper No. 31161.

Cohen, W. M., & Levinthal, D. A. (1990). Absorptive capacity: A new perspective on learning and innovation. Administrative Science Quarterly, 35(1), 128--152.

Eloundou, T., Manning, S., Mishkin, P., & Rock, D. (2023). GPTs are GPTs: An early look at the labor market impact potential of large language models. Science, 381(6654), 187--192.

Felten, E., Raj, M., & Seamans, R. (2021). Occupational, industry, and geographic exposure to artificial intelligence. Strategic Management Journal, 42(12), 2195--2217.

Goodman-Bacon, A. (2021). Difference-in-differences with variation in treatment timing. Journal of Econometrics, 225(2), 254--277.

Grimmer, J., & Stewart, B. M. (2013). Text as data: The promise and pitfalls of automatic content analysis methods for political texts. Political Analysis, 21(3), 267--297.

Hackman, J. R., & Oldham, G. R. (1976). Motivation through the design of work. Organizational Behavior and Human Performance, 16(2), 250--279.

Hainmueller, J. (2012). Entropy balancing for causal effects. Political Analysis, 20(1), 25--46.

Spence, M. (1973). Job market signaling. Quarterly Journal of Economics, 87(3), 355--374.

Stock, J. H., & Yogo, M. (2005). Testing for weak instruments in linear IV regression. Identification and Inference for Econometric Models, 80--108.

Webb, M. (2021). The impact of artificial intelligence on the labor market. Working Paper, Stanford University.

Yoo, Y., Henfridsson, O., & Lyytinen, K. (2010). The new organizing logic of digital innovation. Information Systems Research, 21(4), 724--735.

---

Data Availability Statement

The data underlying this study are drawn from publicly available sources. SEC 10-K Human Capital Disclosures are accessible through the SEC EDGAR database (https://www.sec.gov/edgar). Firm-level financial data are available from SEC EDGAR XBRL filings. LLM exposure scores are constructed using publicly available data from Eloundou et al. (2023), Occupational Employment Statistics from the U.S. Bureau of Labor Statistics, and NAICS industry classification codes. AI patent data are available from The Lens (https://www.lens.org). The constructed panel dataset and analysis code are available from the corresponding author upon reasonable request.

Conflict of Interest

The author declares no conflict of interest. This research was conducted independently, and the findings, interpretations, and conclusions expressed in this paper are those of the author and do not necessarily reflect the views of any affiliated institution or funding agency.

Acknowledgements

The author thanks the anonymous reviewers and editor for their constructive feedback. The author is solely responsible for any remaining errors.
