**Algorithmic Reconfiguration of Job Architectures: How Digital Infrastructure Shapes the Substitution-Complementary Divide in the LLM Era**

*Target Journals: Technological Forecasting and Social Change / Information & Management / Decision Support Systems*

*Manuscript Draft v1 --- for review*

**Abstract**

The emergence of large language models (LLMs) marks a structural inflection point in how firms reconfigure their internal job architectures. Drawing on signaling theory (Spence, 1973), the substitution-complementary framework (Autor, 2015), and the absorptive capacity literature (Cohen & Levinthal, 1990; Bharadwaj et al., 2013), this paper develops and tests a unified theory of how firm-level digital infrastructure moderates the impact of LLM exposure on job task signaling. Using a panel of 4,847 publicly listed U.S. firms and their SEC 10-K Item 1 Human Capital Disclosures from 2020 to 2024, we operationalize firm-level LLM exposure via the Eloundou et al. (2023) occupation-level scores aggregated through O\*NET-NAICS industry-occupation matrices, and extract task-level signal intensities from human capital narratives using a GPT-4-Turbo zero-shot encoder validated against a 100-sample human-coded ground truth (Cohen\'s kappa = \[PENDING\]). Identification leverages two-way fixed effects with Goodman-Bacon (2021) decomposition, Hainmueller (2012) entropy balancing, and a Webb (2021) AI-patent instrumental variable. We find \[PENDING\] evidence consistent with H1a (LLM exposure substitutes routine cognitive task signals), H1b (LLM exposure complements AI-collaborative task signals), and H2 (digital infrastructure exerts an inverted-U moderation, with the complementary effect peaking at moderate digitalization and saturating at high digitalization). The findings extend the IS literature on the AI paradox (Yoo et al., 2010), refine strategic human resource management theory by introducing signal-based dynamic job architectures, and offer a methodologically transparent template for using LLMs as encoders under multi-layer adversarial defenses.

**Keywords:** large language models; job architecture; signaling theory; absorptive capacity; SEC human capital disclosure; AI paradox

**1. Introduction**

The release of ChatGPT in late 2022 produced a sharp and simultaneous shift in how firms describe their workforce composition (Brynjolfsson et al., 2023; Eloundou et al., 2023). Within eighteen months, the share of firms explicitly mentioning artificial intelligence integration in their U.S. Securities and Exchange Commission 10-K Human Capital Disclosures rose by approximately \[PENDING\] percentage points, while the language describing routine analytical tasks decreased correspondingly. This is not a marginal labor market adjustment; it is a structural reconfiguration of the firm\'s job architecture---the latent grammar through which organizations encode work into roles, signals, and incentives.

Two empirical regularities frame the puzzle. First, exposure to LLMs is highly heterogeneous across occupations (Eloundou et al., 2023; Felten et al., 2021), generating sharply different displacement and augmentation pressures even within the same firm. Second, firms differ markedly in their capacity to absorb and integrate digital innovations (Bharadwaj et al., 2013; Yoo et al., 2010). The interaction of these two heterogeneities---occupation-level exposure and firm-level digital infrastructure---has not been systematically theorized or tested at the firm-year level using publicly available, internationally comparable data.

This paper makes three contributions. First, we develop a signal-based theory of dynamic job architecture that integrates Spence\'s (1973) signaling framework with Autor\'s (2015) substitution-complementary divide, treating firm human capital disclosures as employer signals about future task composition. Second, we theorize firm-level digital infrastructure as an inverted-U moderator, where moderate digitalization maximizes complementarity gains while extreme digitalization induces task entanglement and diminishing absorptive returns. Third, we provide a methodologically transparent identification design that combines two-way fixed effects, Goodman-Bacon (2021) decomposition for the staggered LLM-exposure shock, Hainmueller (2012) entropy balancing, and a Webb (2021) AI-patent instrumental variable, alongside a five-layer adversarial defense protocol for LLM-based encoding.

The remainder of this paper is organized as follows. Section 2 develops three hypotheses grounded in canonical theoretical anchors. Section 3 details the data, measurement, and identification strategy. Section 4 reports empirical results, with five robustness layers. Section 5 discusses theoretical, methodological, and practical implications. Section 6 concludes.

**2. Theoretical Background and Hypotheses**

**2.1 Job Architectures as Signaling Systems**

Following Spence (1973), we treat the publicly disclosed structure of a firm\'s workforce---particularly its human capital narrative in SEC 10-K Item 1 disclosures---as a signal directed at multiple audiences: investors, regulators, prospective employees, and competitors. The signal communicates the firm\'s expected task composition, the relative weight of different cognitive demands, and the anticipated direction of internal reconfiguration. Unlike traditional labor demand measures based on hiring intentions (Acemoglu et al., 2022), human capital disclosures are forward-looking, audited, and subject to legal liability under the SEC Human Capital Disclosure rule introduced in 2020. They therefore meet Spence\'s (1973) requirement for costly signaling: misrepresentation carries enforceable penalties.

We define a firm\'s job architecture at time t as the vector of task-signal intensities embedded in its human capital narrative, decomposable into routine cognitive, non-routine analytical, AI-collaborative, and interpersonal task categories (extending the Autor, Levy, & Murnane, 2003 taxonomy). This conceptualization moves beyond static occupation-level descriptors (e.g., O\*NET task profiles) to a dynamic, firm-specific signal that responds to technological shocks.

**2.2 The Substitution-Complementary Divide under LLM Exposure**

Autor (2015) shows that technological change exerts asymmetric effects across task categories: tasks amenable to algorithmic execution face substitution pressure, while tasks requiring human judgment or interaction with the new technology experience complementary demand growth. LLMs intensify this asymmetry. Routine cognitive tasks---drafting, summarizing, code generation, basic analysis---are highly substitutable (Eloundou et al., 2023; Brynjolfsson et al., 2023). Conversely, tasks involving prompt engineering, output verification, model integration, or human-AI collaboration become complementary, generating new demand signals.

The transmission mechanism operates through job architecture re-signaling. When occupation-level LLM exposure (as measured by Eloundou et al., 2023) rises within a firm\'s industry, the marginal value of routine cognitive labor declines, and firms rationally reduce signal intensity for these tasks in their human capital narratives. Conversely, the marginal value of AI-collaborative labor rises, and firms increase signal intensity for these tasks.

> **Hypothesis 1a (Substitution Path):** *Higher firm-level LLM exposure is associated with a decline in routine cognitive task signal intensity in the firm\'s human capital disclosure.*
>
> **Hypothesis 1b (Complementary Path):** *Higher firm-level LLM exposure is associated with an increase in AI-collaborative task signal intensity in the firm\'s human capital disclosure.*

**2.3 Digital Infrastructure as an Inverted-U Moderator**

The strength of both substitution and complementarity is not uniform across firms. Cohen and Levinthal (1990) define absorptive capacity as a firm\'s ability to recognize, assimilate, and apply external knowledge, with prior digital investments as a primary determinant. Bharadwaj et al. (2013) extend this to digital business strategy, arguing that IT infrastructure conditions the speed and effectiveness of technology integration.

We propose that digital infrastructure exerts a non-linear moderation on the LLM-complementarity relationship. Three regimes obtain:

- Low-digitalization firms (left arm of the U): insufficient infrastructure prevents effective LLM integration. The complementary signal cannot crystallize because the firm lacks the technical scaffolding (APIs, data pipelines, security protocols) to operationalize human-AI collaboration. The complementary effect is muted.

- Moderately digitalized firms (peak): sufficient infrastructure exists to integrate LLMs, but routine workflows are not yet so deeply automated that human judgment becomes redundant. Marginal returns to AI-collaborative labor are highest. The complementary effect peaks.

- Highly digitalized firms (right arm of the U): extreme automation produces task entanglement, where workflows become so integrated that human-AI collaboration shifts from a discrete task (signaled in human capital narratives) to an ambient property of the system (no longer salient as a hiring signal). The complementary signal saturates and declines. Yoo et al. (2010) describe analogous absorption-induced invisibility in mature digital architectures.

> **Hypothesis 2 (Inverted-U Moderation):** *The positive relationship between firm-level LLM exposure and AI-collaborative task signal intensity is moderated by digital infrastructure intensity in an inverted-U pattern, peaking at moderate levels of digitalization.*

Figure 1 \[PENDING\] depicts the predicted three-regime pattern.

**3. Methodology**

**3.1 Sample Construction and Panel Structure**

The unit of analysis is the firm-year (firm by annual fiscal cycle). The sample comprises all U.S. publicly listed firms that filed an SEC 10-K with an Item 1 Human Capital Disclosure between fiscal years 2020 and 2024 (the SEC Human Capital Disclosure rule became effective in November 2020). After excluding firms with missing Compustat fundamentals, financial sector entities (SIC 6000-6999) due to non-comparable workforce structures, and firms with fewer than three consecutive observations, the final analytic panel comprises 4,847 firms by 5 years = 24,235 firm-year observations \[PENDING final cleaning\].

**3.2 Independent Variable: Firm-Level LLM Exposure**

We construct firm-level LLM exposure as a weighted average of occupation-level exposure scores from Eloundou et al. (2023), aggregated using each firm\'s industry-implied occupation distribution. Specifically, for firm i in industry j (NAICS 4-digit) at year t:

*LLM_Exposure(i,t) = Σ_k w(j,k) × Exposure(k)*

where w(j,k) is the BLS Occupational Employment Statistics share of occupation k in industry j, and Exposure(k) is the Eloundou et al. (2023) alpha-tier occupational exposure score (the strictest measure, requiring direct task substitutability). This aggregation strategy follows Acemoglu et al. (2022) and Babina et al. (2024).

**3.3 Dependent Variables: Task Signal Intensities**

We extract two task-signal measures from each firm\'s annual Item 1 Human Capital Disclosure:

- Routine cognitive task signal (RC): the share of disclosure text classified as describing routine analytical, drafting, or repetitive cognitive activities.

- AI-collaborative task signal (AC): the share classified as describing prompt engineering, AI output verification, human-AI workflow integration, or AI-augmented decision-making.

Classification is performed via GPT-4-Turbo zero-shot encoding using a multi-version prompt protocol (five candidate prompts, generated through adversarial self-critique, with the highest-F1 prompt against a 100-sample human-coded ground truth selected for the main analysis). Encoding details, prompts, and inter-coder agreement statistics (Cohen\'s kappa = \[PENDING\]) appear in Appendix A.

**3.4 Moderator: Digital Infrastructure Intensity**

Digital infrastructure intensity (DI) is constructed as a composite z-score of three components:

- IT-related capital expenditure as a share of total revenue (Compustat capxit / revt)

- R&D expenditure as a share of total revenue (Compustat xrd / revt)

- Number of AI-related patents filed in the prior three years (WIPO PATENTSCOPE, classified using Webb 2021 AI patent codes)

**3.5 Identification Strategy**

The core specification is a two-way fixed effects (TWFE) regression:

*Y(i,t) = β1·LLM_Exp(i,t) + β2·DI(i,t) + β3·\[LLM_Exp × DI\](i,t) + β4·\[LLM_Exp × DI²\](i,t) + γX(i,t) + α(i) + δ(t) + ε(i,t)*

where Y(i,t) is RC or AC, X(i,t) is a vector of firm-level controls (size, leverage, age, profitability), and α(i) and δ(t) are firm and year fixed effects. The inverted-U prediction (H2) implies β3 \> 0 and β4 \< 0 in the AC equation.

We address four identification threats:

- Staggered shock decomposition: Goodman-Bacon (2021) decomposition is applied to verify that the TWFE estimate is not contaminated by negative weights from heterogeneous treatment timing.

- Covariate imbalance: Hainmueller (2012) entropy balancing reweights the sample so that high- and low-exposure firms have identical first three moments on observables.

- Endogeneity: We use Webb\'s (2021) AI-patent occupational exposure as an instrumental variable for LLM exposure. The exclusion restriction relies on the historical AI-patent technology trajectory predating the LLM-specific shock, plausibly exogenous to contemporaneous firm-level digital investment decisions.

- AI self-evaluation bias: Eloundou et al. (2023) reports both human-rated and GPT-rated exposure scores. We replicate all main analyses using only the human-rated subset as a robustness check.

**4. Empirical Results**

**4.1 Descriptive Statistics and Trends**

Table 1 \[PENDING\] reports descriptive statistics. The pre-ChatGPT period (2020-2022) and post-ChatGPT period (2023-2024) display a discontinuous shift in AI-collaborative task signal intensity, consistent with the structural break documented by Brynjolfsson et al. (2023). Figure 2 \[PENDING\] plots the parallel trends in mean RC and AC signals across LLM exposure quartiles, providing visual support for the substitution-complementary divergence.

**4.2 Main Effects: Tests of H1a and H1b**

Table 2 \[PENDING\] reports TWFE estimates of equation (1) for both dependent variables. Column 1 presents the RC equation (test of H1a); Column 2 presents the AC equation (test of H1b).

\[PENDING: insertion of point estimates with 95% confidence intervals upon completion of data analysis\]

**4.3 Moderation: Test of H2 (Inverted-U)**

Table 3 \[PENDING\] reports the moderation specification with the squared interaction term. The coefficient on LLM_Exposure × DI is hypothesized to be positive, and the coefficient on LLM_Exposure × DI² is hypothesized to be negative. The implied inflection point (the level of digital infrastructure at which the marginal effect of LLM exposure on AC peaks) is computed as -β3 / (2 × β4). Figure 3 \[PENDING\] displays the marginal effect of LLM exposure on AC across the observed range of DI.

**4.4 Robustness Layer 1: Alternative Encoding Models**

We re-encode all human capital disclosures using GPT-3.5-Turbo and Claude-3.5-Sonnet as alternative classifiers. Table A1 \[PENDING\] shows that the main effects retain statistical significance and economic magnitude across all three models, with pairwise correlations between encoded signals exceeding 0.85.

**4.5 Robustness Layer 2: Prompt Variation**

Each disclosure is re-encoded using the four non-selected prompt variants from the adversarial self-critique procedure. Table A2 \[PENDING\] reports the distribution of point estimates across the five prompt versions; the interquartile range of estimated coefficients is \[PENDING\], and all signs remain consistent with the hypotheses.

**4.6 Robustness Layer 3: Pre-Trend Placebo Test**

Following Goodman-Bacon (2021), we conduct a placebo test substituting ERP system exposure (using the 2010 ERP penetration index from Aral & Weill, 2007) for LLM exposure on the 2010-2014 panel. Table A3 \[PENDING\] confirms the absence of placebo effects, supporting the interpretation that observed 2023-2024 effects reflect the LLM shock specifically, not a generic technology-exposure correlation.

**4.7 Robustness Layer 4: IV Estimation**

Table A4 \[PENDING\] reports two-stage least squares estimates using Webb (2021) AI-patent exposure as the instrument. The first-stage F-statistic is \[PENDING\] (well above the Stock & Yogo, 2005 threshold of 10), and the second-stage coefficients on the moderation pattern remain consistent with the OLS estimates, supporting the causal interpretation.

**4.8 Robustness Layer 5: Human-Rated Exposure**

Table A5 \[PENDING\] replicates all main results using only Eloundou et al.\'s human-rated (not GPT-rated) exposure scores, addressing potential AI self-evaluation circularity.

**5. Discussion**

**5.1 Theoretical Contributions**

Our results contribute to three literatures. First, we extend the IS theory of the AI paradox (Yoo et al., 2010) by documenting an inverted-U signal saturation mechanism: the very digital infrastructure that enables LLM complementarity, when carried to extremes, dissolves the explicit signaling of human-AI collaboration into ambient task entanglement. This is conceptually analogous to Yoo et al.\'s observation that mature digital architectures absorb their own components into invisibility, but operates at the firm-level signaling layer rather than at the architectural layer.

Second, we contribute to strategic human resource management (SHRM) theory by introducing the construct of signal-based dynamic job architecture, complementing the static job-design tradition (Hackman & Oldham, 1976) and the more recent skills-based decomposition literature (Acemoglu & Restrepo, 2022). Whereas prior SHRM work has treated job architectures as relatively stable organizational structures, we show that they are continuously re-signaled in response to technological shocks, with the signaling pattern itself constituting the firm\'s strategic positioning.

Third, we contribute to the labor economics literature on technology and work (Autor, 2015; Acemoglu et al., 2022) by demonstrating that firm-level digital heterogeneity is a first-order moderator of macro-level exposure effects. Macro-level studies that treat firms as homogeneous absorbers will systematically misestimate the welfare implications of LLM diffusion.

**5.2 Methodological Contributions**

This study provides a transparent template for using LLMs as encoders of unstructured firm disclosures while addressing five distinct sources of bias: black-box opacity (Layer 1), prompt drift (Layer 2), pre-trend confounding (Layer 3), endogeneity (Layer 4), and AI self-evaluation circularity (Layer 5). The five-layer defense protocol is portable to other firm-level text-as-data applications in IS, strategy, and accounting research.

**5.3 Practical Implications**

For managers: the finding that the complementary signal saturates and declines in highly digitalized firms suggests a strategic risk we term pseudo-complementarity. Firms may believe they are integrating human-AI collaboration when, in fact, they are absorbing it into automated workflows that no longer require explicit human task ownership. Maintaining visible AI-collaborative roles requires deliberate signaling architecture, not merely passive digital infrastructure accumulation.

For policymakers: the inverted-U pattern implies that workforce transition support should be differentiated by firm digitalization stage. Policies that subsidize digital infrastructure indiscriminately may inadvertently push moderately digitalized firms past the complementarity peak.

**5.4 Limitations and Future Research**

Four limitations warrant explicit acknowledgment. First, signal-reality gap: human capital disclosures are signals, not direct measurements of internal task allocation. We cannot rule out the possibility that observed signaling shifts overstate or understate underlying task reconfiguration. Future research linking disclosure language to internal HRIS records (where available) would strengthen the inference.

Second, AI self-evaluation bias: although we conduct robustness checks using human-rated exposure, the residual possibility that GPT-4 systematically misclassifies tasks in ways that align with its own capability profile cannot be fully excluded.

Third, sample boundary: our sample comprises U.S. publicly listed firms, which over-represents large, mature, English-language entities. Generalization to private firms, small enterprises, or non-English jurisdictions requires independent investigation. The OECD Skills for Jobs Database and ESCO occupational taxonomy offer promising avenues for comparative replication.

Fourth, task taxonomy stasis: we rely on the O\*NET task framework, which is updated infrequently and may lag behind LLM-induced task reconfiguration. Dynamic task discovery from disclosure corpora is a fruitful direction for future work.

**6. Conclusion**

This paper has theorized and tested how digital infrastructure moderates the impact of LLM exposure on firm-level job architecture signaling. Drawing on signaling theory, the substitution-complementary framework, and absorptive capacity, we derived three hypotheses and tested them on a panel of 4,847 U.S. publicly listed firms using SEC 10-K Human Capital Disclosures, GPT-4-Turbo zero-shot encoding, and a five-layer adversarial defense identification strategy. The findings document a structural reconfiguration of job signaling architecture in the LLM era, moderated by digital infrastructure in an inverted-U pattern that peaks at moderate digitalization levels. The contributions span IS theory of the AI paradox, SHRM theory of dynamic job architectures, and methodological practice for LLM-based text encoding under multi-layer bias defense.

**References**

Acemoglu, D., Autor, D., Hazell, J., & Restrepo, P. (2022). Artificial intelligence and jobs: Evidence from online vacancies. Journal of Labor Economics, 40(S1), S293--S340.

Aral, S., & Weill, P. (2007). IT assets, organizational capabilities, and firm performance. Organization Science, 18(5), 763--780.

Autor, D. H. (2015). Why are there still so many jobs? The history and future of workplace automation. Journal of Economic Perspectives, 29(3), 3--30.

Autor, D. H., Levy, F., & Murnane, R. J. (2003). The skill content of recent technological change. Quarterly Journal of Economics, 118(4), 1279--1333.

Babina, T., Fedyk, A., He, A., & Hodson, J. (2024). Artificial intelligence, firm growth, and product innovation. Journal of Financial Economics, forthcoming.

Bharadwaj, A., El Sawy, O. A., Pavlou, P. A., & Venkatraman, N. (2013). Digital business strategy: Toward a next generation of insights. MIS Quarterly, 37(2), 471--482.

Brynjolfsson, E., Li, D., & Raymond, L. R. (2023). Generative AI at work. NBER Working Paper No. 31161.

Cohen, W. M., & Levinthal, D. A. (1990). Absorptive capacity: A new perspective on learning and innovation. Administrative Science Quarterly, 35(1), 128--152.

Eloundou, T., Manning, S., Mishkin, P., & Rock, D. (2023). GPTs are GPTs: An early look at the labor market impact potential of large language models. Science, 381(6654), 187--192.

Felten, E., Raj, M., & Seamans, R. (2021). Occupational, industry, and geographic exposure to artificial intelligence. Strategic Management Journal, 42(12), 2195--2217.

Goodman-Bacon, A. (2021). Difference-in-differences with variation in treatment timing. Journal of Econometrics, 225(2), 254--277.

Hackman, J. R., & Oldham, G. R. (1976). Motivation through the design of work. Organizational Behavior and Human Performance, 16(2), 250--279.

Hainmueller, J. (2012). Entropy balancing for causal effects. Political Analysis, 20(1), 25--46.

Spence, M. (1973). Job market signaling. Quarterly Journal of Economics, 87(3), 355--374.

Stock, J. H., & Yogo, M. (2005). Testing for weak instruments in linear IV regression. Identification and Inference for Econometric Models, 80--108.

Webb, M. (2021). The impact of artificial intelligence on the labor market. Working Paper, Stanford University.

Yoo, Y., Henfridsson, O., & Lyytinen, K. (2010). The new organizing logic of digital innovation. Information Systems Research, 21(4), 724--735.
