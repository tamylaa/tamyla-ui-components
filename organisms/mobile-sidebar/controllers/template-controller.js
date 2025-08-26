/**
 * Template Controller
 * Handles header and footer templates, dynamic content injection, and template switching
 */

import { 
  HEADER_TEMPLATES, 
  FOOTER_TEMPLATES, 
  HEADER_PRESETS, 
  FOOTER_PRESETS, 
  VALIDATION_RULES, 
  EVENT_TYPES 
} from '../config/sidebar-config.js';

class TemplateController {
  constructor(sidebarController, options = {}) {
    this.sidebar = sidebarController;
    this.headerContainer = null;
    this.footerContainer = null;
    this.loadedTemplates = new Map();
    
    this.options = {
      validateTemplates: true,
      cacheTemplates: true,
      allowCustomTemplates: true,
      ...options
    };

    this.currentHeader = null;
    this.currentFooter = null;

    this.initialize();
  }

  /**
   * Initialize template controller
   */
  initialize() {
    this.headerContainer = this.sidebar.elements.header?.querySelector('.header-content');
    this.footerContainer = this.sidebar.elements.footer?.querySelector('.footer-content');
    
    if (!this.headerContainer || !this.footerContainer) {
      throw new Error('Header or footer container not found in sidebar');
    }

    this.preloadTemplates();
  }

  /**
   * Preload commonly used templates
   */
  async preloadTemplates() {
    try {
      await Promise.all([
        this.loadTemplate('header-templates.html'),
        this.loadTemplate('footer-templates.html')
      ]);
    } catch (error) {
      console.warn('Failed to preload templates:', error);
    }
  }

  /**
   * Load template file
   */
  async loadTemplate(templateName) {
    if (this.options.cacheTemplates && this.loadedTemplates.has(templateName)) {
      return this.loadedTemplates.get(templateName);
    }

    try {
      const response = await fetch(`/ui-components/organisms/mobile-sidebar/templates/${templateName}`);
      if (!response.ok) throw new Error(`Template not found: ${templateName}`);
      
      const template = await response.text();
      
      if (this.options.cacheTemplates) {
        this.loadedTemplates.set(templateName, template);
      }
      
      return template;
    } catch (error) {
      console.warn(`Failed to load template ${templateName}, using fallback`);
      return this.getFallbackTemplate(templateName);
    }
  }

  /**
   * Get fallback templates
   */
  getFallbackTemplate(templateName) {
    const fallbacks = {
      'header-templates.html': `
        <div class="sidebar-header-simple" data-template="simple">
          <div class="header-brand">
            <span class="brand-logo"></span>
            <span class="brand-text"></span>
          </div>
        </div>
        <div class="sidebar-header-profile" data-template="profile">
          <div class="header-profile">
            <div class="profile-avatar">
              <img class="avatar-image" src="" alt="User avatar">
              <div class="avatar-status"></div>
            </div>
            <div class="profile-info">
              <div class="profile-name"></div>
              <div class="profile-role"></div>
            </div>
          </div>
        </div>
      `,
      'footer-templates.html': `
        <div class="sidebar-footer-simple" data-template="simple">
          <div class="footer-text"></div>
        </div>
        <div class="sidebar-footer-status" data-template="status">
          <div class="footer-status">
            <div class="status-item">
              <span class="status-label">Version</span>
              <span class="status-value"></span>
            </div>
          </div>
        </div>
      `
    };
    
    return fallbacks[templateName] || '<div>Template not found</div>';
  }

  /**
   * Set header from preset
   */
  async setHeaderPreset(presetName) {
    const preset = HEADER_PRESETS[presetName];
    if (!preset) {
      throw new Error(`Header preset not found: ${presetName}`);
    }

    return await this.setHeader(preset.template, preset.data);
  }

  /**
   * Set footer from preset
   */
  async setFooterPreset(presetName) {
    const preset = FOOTER_PRESETS[presetName];
    if (!preset) {
      throw new Error(`Footer preset not found: ${presetName}`);
    }

    return await this.setFooter(preset.template, preset.data);
  }

  /**
   * Set header template and data
   */
  async setHeader(templateType, data = {}) {
    if (this.options.validateTemplates && !this.validateHeaderConfig({ template: templateType, data })) {
      throw new Error('Invalid header configuration');
    }

    try {
      const templateHtml = await this.loadTemplate('header-templates.html');
      const headerElement = this.extractTemplate(templateHtml, templateType);
      
      if (!headerElement) {
        throw new Error(`Header template not found: ${templateType}`);
      }

      this.populateHeaderData(headerElement, data);
      this.renderHeader(headerElement);
      
      this.currentHeader = { template: templateType, data };
      
      this.sidebar.emit(EVENT_TYPES.HEADER_ACTION, {
        action: 'template-changed',
        template: templateType,
        data
      });

      return true;
    } catch (error) {
      console.error('Failed to set header:', error);
      return false;
    }
  }

  /**
   * Set footer template and data
   */
  async setFooter(templateType, data = {}) {
    if (this.options.validateTemplates && !this.validateFooterConfig({ template: templateType, data })) {
      throw new Error('Invalid footer configuration');
    }

    try {
      const templateHtml = await this.loadTemplate('footer-templates.html');
      const footerElement = this.extractTemplate(templateHtml, templateType);
      
      if (!footerElement) {
        throw new Error(`Footer template not found: ${templateType}`);
      }

      this.populateFooterData(footerElement, data);
      this.renderFooter(footerElement);
      
      this.currentFooter = { template: templateType, data };
      
      this.sidebar.emit(EVENT_TYPES.FOOTER_ACTION, {
        action: 'template-changed',
        template: templateType,
        data
      });

      return true;
    } catch (error) {
      console.error('Failed to set footer:', error);
      return false;
    }
  }

  /**
   * Extract template from HTML
   */
  extractTemplate(html, templateType) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const template = tempDiv.querySelector(`[data-template="${templateType}"]`);
    return template ? template.cloneNode(true) : null;
  }

  /**
   * Populate header data
   */
  populateHeaderData(element, data) {
    const template = element.getAttribute('data-template');
    
    switch (template) {
      case HEADER_TEMPLATES.SIMPLE:
        this.populateSimpleHeader(element, data);
        break;
      case HEADER_TEMPLATES.PROFILE:
        this.populateProfileHeader(element, data);
        break;
      case HEADER_TEMPLATES.TRADING:
        this.populateTradingHeader(element, data);
        break;
      case HEADER_TEMPLATES.CUSTOM:
        this.populateCustomHeader(element, data);
        break;
    }
  }

  /**
   * Populate simple header
   */
  populateSimpleHeader(element, data) {
    const logo = element.querySelector('.brand-logo');
    const text = element.querySelector('.brand-text');
    
    if (logo && data.logo) {
      logo.textContent = data.logo;
    }
    
    if (text && data.text) {
      text.textContent = data.text;
    }
  }

  /**
   * Populate profile header
   */
  populateProfileHeader(element, data) {
    const avatar = element.querySelector('.avatar-image');
    const status = element.querySelector('.avatar-status');
    const name = element.querySelector('.profile-name');
    const role = element.querySelector('.profile-role');
    
    if (avatar && data.avatar) {
      avatar.src = data.avatar;
      avatar.alt = `${data.name || 'User'} avatar`;
    }
    
    if (status && data.status) {
      status.className = `avatar-status status-${data.status}`;
    }
    
    if (name && data.name) {
      name.textContent = data.name;
    }
    
    if (role && data.role) {
      role.textContent = data.role;
    }
  }

  /**
   * Populate trading header
   */
  populateTradingHeader(element, data) {
    const statusText = element.querySelector('.status-text');
    const statusDot = element.querySelector('.status-dot');
    const balanceAmount = element.querySelector('.balance-amount');
    
    if (statusText && data.status) {
      statusText.textContent = data.status;
    }
    
    if (statusDot && data.statusType) {
      statusDot.className = `status-dot status-${data.statusType}`;
    }
    
    if (balanceAmount && data.balance) {
      balanceAmount.textContent = data.balance;
    }
  }

  /**
   * Populate custom header
   */
  populateCustomHeader(element, data) {
    const customContainer = element.querySelector('.header-custom');
    if (customContainer && data.html) {
      customContainer.innerHTML = data.html;
    }
  }

  /**
   * Populate footer data
   */
  populateFooterData(element, data) {
    const template = element.getAttribute('data-template');
    
    switch (template) {
      case FOOTER_TEMPLATES.SIMPLE:
        this.populateSimpleFooter(element, data);
        break;
      case FOOTER_TEMPLATES.ACTIONS:
        this.populateActionsFooter(element, data);
        break;
      case FOOTER_TEMPLATES.STATUS:
        this.populateStatusFooter(element, data);
        break;
      case FOOTER_TEMPLATES.TRADING:
        this.populateTradingFooter(element, data);
        break;
      case FOOTER_TEMPLATES.CUSTOM:
        this.populateCustomFooter(element, data);
        break;
    }
  }

  /**
   * Populate simple footer
   */
  populateSimpleFooter(element, data) {
    const text = element.querySelector('.footer-text');
    if (text && data.text) {
      text.textContent = data.text;
    }
  }

  /**
   * Populate actions footer
   */
  populateActionsFooter(element, data) {
    const actionsContainer = element.querySelector('.footer-actions');
    if (!actionsContainer || !data.actions) return;
    
    actionsContainer.innerHTML = '';
    
    data.actions.forEach(action => {
      const button = document.createElement('button');
      button.className = 'footer-action';
      button.type = 'button';
      button.setAttribute('data-action', action.action);
      
      const icon = document.createElement('span');
      icon.className = 'action-icon';
      icon.textContent = action.icon || '';
      
      const text = document.createElement('span');
      text.className = 'action-text';
      text.textContent = action.text || '';
      
      button.appendChild(icon);
      button.appendChild(text);
      
      button.addEventListener('click', () => {
        this.sidebar.emit(EVENT_TYPES.FOOTER_ACTION, {
          action: action.action,
          data: action
        });
      });
      
      actionsContainer.appendChild(button);
    });
  }

  /**
   * Populate status footer
   */
  populateStatusFooter(element, data) {
    const versionValue = element.querySelector('.status-item:nth-child(1) .status-value');
    const serverValue = element.querySelector('.status-item:nth-child(2) .status-value');
    
    if (versionValue && data.version) {
      versionValue.textContent = data.version;
    }
    
    if (serverValue && data.server) {
      serverValue.textContent = data.server;
      if (data.serverStatus) {
        serverValue.className = `status-value status-${data.serverStatus}`;
      }
    }
  }

  /**
   * Populate trading footer
   */
  populateTradingFooter(element, data) {
    const pnlValue = element.querySelector('.summary-item:nth-child(1) .summary-value');
    const positionsValue = element.querySelector('.summary-item:nth-child(2) .summary-value');
    const positionsLabel = element.querySelector('.summary-item:nth-child(2) .summary-label');
    
    if (pnlValue && data.pnl) {
      pnlValue.textContent = data.pnl;
      if (data.pnlType) {
        pnlValue.className = `summary-value ${data.pnlType}`;
      }
    }
    
    if (positionsValue && data.positions) {
      positionsValue.textContent = data.positions;
    }
    
    if (positionsLabel && data.positionsLabel) {
      positionsLabel.textContent = data.positionsLabel;
    }
  }

  /**
   * Populate custom footer
   */
  populateCustomFooter(element, data) {
    const customContainer = element.querySelector('.footer-custom');
    if (customContainer && data.html) {
      customContainer.innerHTML = data.html;
    }
  }

  /**
   * Render header
   */
  renderHeader(element) {
    this.headerContainer.innerHTML = '';
    this.headerContainer.appendChild(element);
  }

  /**
   * Render footer
   */
  renderFooter(element) {
    this.footerContainer.innerHTML = '';
    this.footerContainer.appendChild(element);
  }

  /**
   * Update header data
   */
  updateHeaderData(newData) {
    if (!this.currentHeader) return false;
    
    const updatedData = { ...this.currentHeader.data, ...newData };
    return this.setHeader(this.currentHeader.template, updatedData);
  }

  /**
   * Update footer data
   */
  updateFooterData(newData) {
    if (!this.currentFooter) return false;
    
    const updatedData = { ...this.currentFooter.data, ...newData };
    return this.setFooter(this.currentFooter.template, updatedData);
  }

  /**
   * Clear header
   */
  clearHeader() {
    this.headerContainer.innerHTML = '';
    this.currentHeader = null;
    return true;
  }

  /**
   * Clear footer
   */
  clearFooter() {
    this.footerContainer.innerHTML = '';
    this.currentFooter = null;
    return true;
  }

  /**
   * Get current header configuration
   */
  getCurrentHeader() {
    return this.currentHeader ? { ...this.currentHeader } : null;
  }

  /**
   * Get current footer configuration
   */
  getCurrentFooter() {
    return this.currentFooter ? { ...this.currentFooter } : null;
  }

  /**
   * Validate header configuration
   */
  validateHeaderConfig(config) {
    return this.validateTemplateConfig(config, VALIDATION_RULES.header);
  }

  /**
   * Validate footer configuration
   */
  validateFooterConfig(config) {
    return this.validateTemplateConfig(config, VALIDATION_RULES.footer);
  }

  /**
   * Validate template configuration
   */
  validateTemplateConfig(config, rules) {
    for (const [field, rule] of Object.entries(rules)) {
      const value = config[field];
      
      if (rule.required && (value === undefined || value === null)) {
        console.error(`Missing required field: ${field}`);
        return false;
      }
      
      if (value !== undefined) {
        if (rule.type && typeof value !== rule.type) {
          console.error(`Invalid type for ${field}: expected ${rule.type}`);
          return false;
        }
        
        if (rule.enum && !rule.enum.includes(value)) {
          console.error(`Invalid value for ${field}: must be one of ${rule.enum.join(', ')}`);
          return false;
        }
      }
    }
    
    return true;
  }

  /**
   * Register custom template
   */
  registerCustomTemplate(name, html) {
    if (!this.options.allowCustomTemplates) {
      throw new Error('Custom templates are not allowed');
    }
    
    this.loadedTemplates.set(name, html);
    return true;
  }

  /**
   * Get available header templates
   */
  getAvailableHeaderTemplates() {
    return Object.values(HEADER_TEMPLATES);
  }

  /**
   * Get available footer templates
   */
  getAvailableFooterTemplates() {
    return Object.values(FOOTER_TEMPLATES);
  }

  /**
   * Get available header presets
   */
  getAvailableHeaderPresets() {
    return Object.keys(HEADER_PRESETS);
  }

  /**
   * Get available footer presets
   */
  getAvailableFooterPresets() {
    return Object.keys(FOOTER_PRESETS);
  }

  /**
   * Clear template cache
   */
  clearTemplateCache() {
    this.loadedTemplates.clear();
    return true;
  }
}

export default TemplateController;
