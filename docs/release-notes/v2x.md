# QA ZERO v2.X Release Notes

# 2.4.6 Release Information

- **Product**: QA ZERO
- **Version**: 2.4.6
- **Release Date**: August 20, 2025
- **Release Type**: Patch

---

### 📊 Overview  
This release includes a total of 15 improvements, such as bug fixes, feature enhancements, performance optimizations, and documentation updates. The focus was on extending QA ZERO's file functionality, improving the heatmap feature, enhancing Google API integration, and ensuring data consistency.

### 🚀 Key Features and Improvements

🔧 System Improvements and Bug Fixes

**Heatmap Feature Enhancements**
- **Added jQuery fallback functionality**
    - Improved heatmap functionality in environments where jQuery cannot be used within iframes.
    - Implemented native JavaScript alternatives for scroll tracking, click tracking, and mouse movement detection.
    - Added compatibility checks and fallback handling for 8 major functions.

- **Fixed iframe display issues for mobile heatmaps**
    - Implemented a feature to exclude QA ZERO CSS files within iframes.
    - Resolved large text display issues in mobile views.
    - Normalized heatmap and replay displays.

### Release Decision

- **Decision**: GO
- **Decision Date**: August 19, 2025
- **Notes**: All quality gates cleared, release approved