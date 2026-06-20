\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{scinexus}[2026/05/12 SciNexus Publications Class]

\LoadClass[12pt, letterpaper]{article}

% --- STEP 1: RESOLVE FONT CONFLICTS ---
\RequirePackage[utf8]{inputenc}
\RequirePackage[T1]{fontenc}

% 1. Load savesym to manage duplicate command errors
\RequirePackage{savesym}

% 2. Load professional Times text
\RequirePackage{newtxtext}

% 3. Load math font FIRST and save symbols that conflict with amssymb/amsthm
\RequirePackage[libertine]{newtxmath}
\savesymbol{Bbbk}
\savesymbol{openbox}

% 4. Load Sans-Serif for a modern journal look
\RequirePackage[scaled=0.92]{helvet}
\RequirePackage{courier}

% --- STEP 2: LOAD ACADEMIC PACKAGES ---
\RequirePackage{geometry}
\RequirePackage{graphicx}
\RequirePackage{amsmath}
\RequirePackage{amssymb}
\RequirePackage{amsthm}

% --- STEP 3: ADDITIONAL TOOLS ---
\RequirePackage{hyperref}
\RequirePackage{authblk}
\RequirePackage{fancyhdr}
\RequirePackage{titlesec}
\RequirePackage{xcolor}
\RequirePackage{booktabs}
\RequirePackage{algorithm}
\RequirePackage{algpseudocode}
\RequirePackage{natbib}
\RequirePackage{orcidlink}
\RequirePackage{listings}
\RequirePackage{tipa}
\RequirePackage{etoolbox}

% --- STEP 4: DESIGN & COLORS ---
\definecolor{scinexusblue}{HTML}{0056b3}

\geometry{margin=1in, headheight=45pt, top=1.2in, footskip=30pt}
\setlength{\parskip}{0.5em}
\setlength{\parindent}{0pt}

% Header/Footer Design
\fancypagestyle{firstpage}{
	\fancyhf{}
	\lhead{\includegraphics[height=30pt]{Logo.pdf}}
	\rhead{\small \sffamily \textit{SciNexus Publications- \url{https://scinexuspub.com}}}
	\renewcommand{\headrulewidth}{0pt}
}

\pagestyle{fancy}
\fancyhf{}
\rhead{\small \sffamily \textit{\@runningtitle}}
\cfoot{\thepage}
\renewcommand{\headrulewidth}{0.4pt}

% Custom Commands
\def\runningtitle#1{\def\@runningtitle{#1}}
\def\keywords#1{\vspace{1em}\noindent\textbf{\sffamily Keywords:} #1}

% Rule-Framed Title Block
\let\oldmaketitle\maketitle
\renewcommand{\maketitle}{
	\date{} 
	\oldmaketitle
	\thispagestyle{firstpage}
}

\patchcmd{\@maketitle}{\@title}{%
	\noindent\rule{\textwidth}{1.2pt} \par \vspace{12pt}
	{\Huge \sffamily \bfseries \color{scinexusblue} \@title} 
	\par \vspace{12pt} 
	\noindent\rule{\textwidth}{1.2pt}
}{}{}

% Modern Section Formatting (Sans-Serif)
\titleformat{\section}{\large\sffamily\bfseries\color{scinexusblue}}{\thesection.}{0.5em}{\uppercase}
\titleformat{\subsection}{\normalsize\sffamily\bfseries\color{scinexusblue}}{\thesubsection}{0.5em}{}
\titleformat{\subsubsection}{\small\sffamily\bfseries}{\thesubsubsection}{0.5em}{}

% Author/Affiliation Styling
\renewcommand\Authfont{\normalsize\sffamily\bfseries}
\renewcommand\Affilfont{\small\sffamily\itshape}

\endinput