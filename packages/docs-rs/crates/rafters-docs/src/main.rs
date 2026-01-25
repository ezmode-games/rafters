//! Rafters Docs CLI - Rust-powered component documentation generator.

use std::path::PathBuf;

use anyhow::Result;
use clap::{Parser, Subcommand};
use tracing_subscriber::{fmt, EnvFilter};

mod commands;

#[derive(Parser)]
#[command(name = "rafters-docs")]
#[command(about = "Rust-powered component documentation generator")]
#[command(version)]
pub struct Cli {
    #[command(subcommand)]
    command: Commands,

    /// Path to docs.toml config file
    #[arg(short, long, default_value = "docs.toml")]
    config: PathBuf,

    /// Enable verbose output
    #[arg(short, long)]
    verbose: bool,
}

#[derive(Subcommand)]
enum Commands {
    /// Initialize documentation in current project
    Init {
        /// Skip interactive prompts, use defaults
        #[arg(short, long)]
        yes: bool,
    },

    /// Start development server with hot reload
    Dev {
        /// Port to listen on
        #[arg(short, long, default_value = "7777")]
        port: u16,

        /// Do not open browser
        #[arg(long)]
        no_open: bool,
    },

    /// Build static documentation site
    Build {
        /// Output directory (defaults to config or "dist")
        #[arg(short, long)]
        output: Option<PathBuf>,

        /// Skip minification
        #[arg(long)]
        no_minify: bool,
    },

    /// Preview built documentation
    Serve {
        /// Port to listen on
        #[arg(short, long, default_value = "4000")]
        port: u16,

        /// Directory to serve
        #[arg(short, long, default_value = "dist")]
        dir: PathBuf,
    },
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    // Initialize logging
    let filter = if cli.verbose {
        EnvFilter::new("debug")
    } else {
        EnvFilter::new("info")
    };

    fmt().with_env_filter(filter).with_target(false).init();

    // Execute command
    match cli.command {
        Commands::Init { yes } => {
            commands::init::run(yes).await?;
        }
        Commands::Dev { port, no_open } => {
            commands::dev::run(port, !no_open).await?;
        }
        Commands::Build { output, no_minify } => {
            let minify = if no_minify { Some(false) } else { None };
            commands::build::run(output, minify).await?;
        }
        Commands::Serve { port, dir } => {
            commands::serve::run(port, dir).await?;
        }
    }

    Ok(())
}
