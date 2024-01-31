import Link from 'next/link'

export function Logo({ className = '' }) {
  return (
    <Link className="flex items-center" href="/">
      <svg
        className={`${className} w-8 h-8 fill-sky-500`}
        viewBox="0 0 374 374"
      >
        <path d="M301.2 354.992C304.749 358.471 310.448 358.415 313.927 354.865L370.629 297.022C374.109 293.472 374.052 287.774 370.502 284.294C366.953 280.815 361.255 280.872 357.775 284.421L307.373 335.837L255.957 285.435C252.407 281.956 246.709 282.013 243.23 285.562C239.75 289.112 239.807 294.81 243.356 298.29L301.2 354.992ZM297 198.09L298.5 348.654L316.5 348.475L315 197.91L297 198.09Z" />
        <path d="M91.632 195.683C94.596 195.151 97.788 194.847 101.208 194.771C104.704 194.619 107.516 194.543 109.644 194.543C111.924 194.543 114.584 194.619 117.624 194.771C120.664 194.847 123.666 195.151 126.63 195.683L146.694 263.969C147.15 265.641 147.796 268.149 148.632 271.493C149.544 274.837 150.456 278.447 151.368 282.323C152.356 286.199 153.23 289.885 153.99 293.381C154.75 296.801 155.244 299.423 155.472 301.247H156.84C157.144 299.423 157.676 296.801 158.436 293.381C159.272 289.885 160.146 286.199 161.058 282.323C162.046 278.447 162.958 274.837 163.794 271.493C164.63 268.149 165.314 265.641 165.846 263.969L185.91 195.683C188.95 195.151 191.952 194.847 194.916 194.771C197.956 194.619 200.578 194.543 202.782 194.543C204.986 194.543 207.76 194.619 211.104 194.771C214.524 194.847 217.754 195.151 220.794 195.683L232.878 350.951C230.978 351.407 228.774 351.749 226.266 351.977C223.834 352.281 221.516 352.433 219.312 352.433C217.26 352.433 215.246 352.357 213.27 352.205C211.37 352.053 209.432 351.825 207.456 351.521L202.554 272.063C202.25 267.655 201.984 262.639 201.756 257.015C201.528 251.391 201.3 245.729 201.072 240.029C200.92 234.253 200.806 229.085 200.73 224.525H199.362L169.722 327.695C167.746 327.999 165.466 328.227 162.882 328.379C160.374 328.531 158.094 328.607 156.042 328.607C154.218 328.607 152.014 328.531 149.43 328.379C146.922 328.227 144.642 327.999 142.59 327.695L113.064 224.525H111.81C111.658 229.085 111.468 234.253 111.24 240.029C111.088 245.729 110.898 251.391 110.67 257.015C110.442 262.639 110.214 267.655 109.986 272.063L104.856 351.521C102.956 351.825 100.98 352.053 98.928 352.205C96.952 352.357 94.938 352.433 92.886 352.433C90.758 352.433 88.44 352.281 85.932 351.977C83.5 351.749 81.372 351.407 79.548 350.951L91.632 195.683Z" />
        <path d="M342.042 109.872C296.373 89.674 252.575 85.424 209.174 99.063C183.993 106.934 165.866 106.363 151.257 82.639C147.474 76.445 142.019 69.537 125.518 71.707C143.914 126.444 101.73 158.434 77.189 198.545C61.1 224.789 53.767 254.535 53.609 286.445C7.98787 255.073 -10.5376 194.642 6.34687 135.903C27.5696 61.333 97.139 4.60479 171.867 0.777892C249.142 -3.09461 313.203 36.73 342.042 109.872Z" />
      </svg>

      <span className="ml-2 font-medium text-2xl">MDX Editor</span>
    </Link>
  )
}
