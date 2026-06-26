const fs = require('fs');

const files = ['src/routes/_auth.login.tsx', 'src/routes/_auth.register.tsx'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Replace standard sx prop values
  content = content.replace(/'var\(--mui-palette-background-default\)'/g, "'background.default'");
  content = content.replace(/'var\(--mui-palette-background-paper\)'/g, "'background.paper'");
  content = content.replace(/'var\(--mui-palette-text-primary\)'/g, "'text.primary'");
  content = content.replace(/'var\(--mui-palette-text-secondary\)'/g, "'text.secondary'");
  content = content.replace(/'var\(--mui-palette-primary-main\)'/g, "'primary.main'");
  content = content.replace(/'var\(--mui-palette-primary-contrastText\)'/g, "'primary.contrastText'");
  content = content.replace(/'var\(--mui-palette-primary-dark\)'/g, "'primary.dark'");
  content = content.replace(/'var\(--mui-palette-action-hover\)'/g, "'action.hover'");
  content = content.replace(/'var\(--mui-palette-divider\)'/g, "'divider'");

  // Replace Lucide icon colors
  content = content.replace(/color="var\(--mui-palette-primary-main\)"/g, 'color="inherit"');
  content = content.replace(/color="var\(--mui-palette-text-secondary\)"/g, 'color="inherit"');

  content = content.replace(/<Activity\n\s*size={20}\n\s*style={{\n\s*color: 'var\(--mui-palette-primary-main\)',/g, `<Activity\n                size={20}\n                style={{\n                  color: 'inherit',`);
  content = content.replace(/<Globe\n\s*size={20}\n\s*style={{\n\s*color: 'var\(--mui-palette-primary-main\)',/g, `<Globe\n                size={20}\n                style={{\n                  color: 'inherit',`);
  content = content.replace(/<Zap\n\s*size={20}\n\s*style={{\n\s*color: 'var\(--mui-palette-primary-main\)',/g, `<Zap\n                size={20}\n                style={{\n                  color: 'inherit',`);

  // Wrap the left panel icons with Box having color primary.main
  content = content.replace(/<Activity\n\s*size={20}\n\s*style={{\n\s*color: 'inherit',\n\s*marginBottom: 8,\n\s*}}\n\s*\/>/g, `<Box sx={{ color: 'primary.main', display: 'flex' }}><Activity size={20} style={{ marginBottom: 8 }} /></Box>`);
  content = content.replace(/<Globe\n\s*size={20}\n\s*style={{\n\s*color: 'inherit',\n\s*marginBottom: 8,\n\s*}}\n\s*\/>/g, `<Box sx={{ color: 'primary.main', display: 'flex' }}><Globe size={20} style={{ marginBottom: 8 }} /></Box>`);
  content = content.replace(/<Zap\n\s*size={20}\n\s*style={{\n\s*color: 'inherit',\n\s*marginBottom: 8,\n\s*}}\n\s*\/>/g, `<Box sx={{ color: 'primary.main', display: 'flex' }}><Zap size={20} style={{ marginBottom: 8 }} /></Box>`);


  // Input adornment svg color transition for MUI inputs
  content = content.replace(/color: 'var\(--mui-palette-primary-main\)',/g, "color: 'primary.main',");
  content = content.replace(/color: 'var\(--mui-palette-text-secondary\)',/g, "color: 'text.secondary',");
  content = content.replace(/color: 'var\(--mui-palette-background-paper\)',/g, "color: 'background.paper',");
  content = content.replace(/color: 'var\(--mui-palette-text-primary\)',/g, "color: 'text.primary',");
  content = content.replace(/bgcolor: 'var\(--mui-palette-action-hover\)',/g, "bgcolor: 'action.hover',");


  content = content.replace(/<InputAdornment position="end">/g, '<InputAdornment position="end" sx={{ color: \'text.secondary\' }}>');
  // And the mail icon is updated to inherit above or just remove color prop
  content = content.replace(/color="inherit"/g, 'color="currentColor"');

  content = content.replace(/border: '1px solid var\(--mui-palette-divider\)'/g, "border: '1px solid', borderColor: 'divider'");
  content = content.replace(/border: '1px solid var\(--mui-palette-primary-main\)'/g, "border: '1px solid', borderColor: 'primary.main'");

  fs.writeFileSync(file, content);
});

console.log("Done");
